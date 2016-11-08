'use strict';

/* DIrectives */

var cuDirectives = angular.module('cuDirectives', []);
cuDirectives.directive('radarDiagram', ['$log', 'TechnologyRadar', '$rootScope', '$sce',
    function ($log, TechnologyRadar, $rootScope, $sce) {
        return {
            restrict: 'E',
            templateUrl: '/static/partials/radar.html',
            replace: true,

            link: function (scope, element, attrs) {

                var init = function () {
                    /**
                     get the categories length using the techList
                     */
                    $(element).html('');
                    var numCategories = scope.categories.length, equalPortions = [];
                    // var numCategories = scope.categories.length, equalPortions = [];
                    /* no of quads needed for the diagram*/
                    _(numCategories).times(function () {
                        equalPortions.push(100 / numCategories)
                    });
                    var width = attrs.width,
                        height = attrs.height,
                        padding = 30,
                        diagramRadius = Math.min(attrs.width, attrs.height) / 2 - padding;

                    /**
                     *  category20 has different color schemes
                     *  domain specifics the range of data
                     *  color -- will have the scale function
                     *  color.range() -- will have the list of 20 colors
                     *  colorGroups -- has object created by _.groupBy that splits the 20 numbers into 5 groups of 4
                     */

                    var color = d3.scale.category20c().domain(_.range(20));
                    var colorFiveGroupsOfSeven = d3.scale.category20c().copy();

                    var colorGroups = _.groupBy(color.range(), function (a, b) {
                        return Math.floor(b / 4);
                    });
                    /**
                     * _.flatten --> flatten a nested array
                     * _.map --> colorGroups is an object  so use this to loop through it
                     expandedGroup -  will have 7 color shades created from 4 using interpolateRgb
                     creating colorFiveGroupsOfSeven 35 colors
                     */
                    colorFiveGroupsOfSeven.range(_.flatten(_.map(colorGroups, function (group) {
                        var expandedGroup = [];
                        _.each(group, function (item, index, group) {
                            expandedGroup.push(item);
                            if (index < group.length - 1) {
                                expandedGroup.push(d3.interpolateRgb(item, group[index + 1])(.5));
                            }
                        });
                        return expandedGroup;
                    })));
                    colorFiveGroupsOfSeven.domain(_.range(35));
                    /**
                     * to form the pie use pie layout
                     * using equalportions array create the division in the pie
                     * define the category types
                     */
                    var pie = d3.layout.pie()
                        .sort(null);

                    var categoryPie = pie(equalPortions);
                    var categoryArcs = {
                        "Tools": categoryPie[0],
                        "Techniques": categoryPie[1],
                        "Platforms": categoryPie[2],
                        "Languages": categoryPie[3]
                    };
                    var tooltip = d3.select("body")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("width", "300px")
                        .style("position", "absolute")
                        .style("z-index", "10")
                        .style("visibility", "hidden");

                    /**
                     * arc drawing
                     * element -- is the div coming from radar.html
                     * svgarcs, svgnodes -- create one svg element
                     */
                    var arc = d3.svg.arc();

                    var svg = d3.select(element[0]).append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .attr("id", 'radar');
                    var svgArcs = svg.append("g")
                        .attr("transform", "translate(" + (width / 2 - padding) + "," + (height / 2 - padding) + ")");
                    var svgNodes = svg.append("g")
                        .attr("transform", "translate(" + (width / 2 - padding) + "," + (height / 2 - padding) + ")");

                    /**
                     *  radiusSoftener should be close to 1
                     */
                    function getInnerRadius(outermostRadius, numRings, ringIndex) {
                        var radiusSoftener = 1;

                        var totalArea = Math.PI * Math.pow(outermostRadius, 2);
                        var ringArea = totalArea / numRings;

                        function innerRadiusHelper(outerRadius, area) {
                            var squared = (Math.PI * Math.pow(outerRadius, 2) * Math.pow(radiusSoftener, 2) - area) / Math.PI;
                            return squared > 0 ? Math.sqrt(squared) : 0;
                        }

                        var currentRing = numRings - 1;
                        var currentOuterRadius = outermostRadius;
                        while (currentRing-- > ringIndex) {
                            currentOuterRadius = innerRadiusHelper(currentOuterRadius, ringArea);
                        }

                        return Math.max(0, innerRadiusHelper(currentOuterRadius, ringArea));
                    }

                    /**
                     *
                     * @param o
                     * @returns {boolean}
                     * tp place an element/item on the diagram
                     */

                    function isOverlappingAnotherPoint(o) {
                        function distance(a, b) {
                            return Math.sqrt(Math.pow(Math.abs(a.x - b.x), 2) + Math.pow(Math.abs(a.y - b.y), 2));
                        }

                        /* If two nodes are within a box of xThreshold-by-yThreshold dimensions, reject this placement */
                        /* This should scale with the diagramRadius
                         * diagram Radius is set bsed on the parent div's width and height */
                        var xThreshold = 70;//.15 * diagramRadius;
                        var yThreshold = 10;//.045 * diagramRadius;

                        var foundOne = false;
                        _.each(scope.technologies, function (p) {
                            if (o !== p && o.x && o.y && p.x && p.y) {
                                if (Math.abs(o.x - p.x) < xThreshold && Math.abs(o.y - p.y) < yThreshold) {
                                    //distance(o, p) < threshold) {
                                    foundOne = true;
                                }
                            }
                        });
                        return foundOne;
                    }

                    var defaultTechRadius = 5;
                    var hoverTechRadius = 7;
                    var radialBuffer = 10;

                    function applyRandomXY(arc, d) {
                        inner = arc.innerRadius + radialBuffer;
                        outer = arc.outerRadius - radialBuffer;
                        var r = (Math.random() * (outer - inner)) + inner;

                        var angularBuffer = Math.atan(radialBuffer / r);

                        var inner = arc.startAngle + angularBuffer;
                        var outer = arc.endAngle - angularBuffer;
                        var theta = (Math.random() * (outer - inner)) + inner;

                        d.x = r * Math.cos(theta - (Math.PI / 2));
                        d.y = r * Math.sin(theta - (Math.PI / 2));
                    }

                    /**
                     * arcStatusEnter --> the 4 category objects --> [adopt,trail,assess,hold] object
                     * arcCategoryEnter --> for each arcStatusEnter have categories created
                     * [Array[4],Array[4],Array[4],Array[4]]
                     * 4  svg elements with class ring is formed,
                     * inside each ring 4 elements for categories with class slice is formed
                     */

                    var arcStatusEnter = svgArcs.selectAll("g").data(scope.techList).enter().append("g").attr("class", "ring");
                    var arcCategoryEnter = arcStatusEnter.selectAll("path")
                        .data(function (d) {
                            return d.categories;
                        }).enter().append("g").attr("class", "slice");

                    /**
                     * for each of those 4 items in each array place them on the ring
                     */
                    arcCategoryEnter.append("path")
                        .attr("fill", function (d, slice, ring) {
                            return colorFiveGroupsOfSeven(7 * slice + ring + 2);
                        })
                        .attr("stroke", "grey")
                        .attr("stroke-width", "1px")
                        .attr("stroke-opacity", ".25")
                        .datum(function (d, i, j) {
                            var self = this;
                            var numRings = _.size(scope.statuses);
                            d.arc = { innerRadius: getInnerRadius(diagramRadius, numRings, j),
                                outerRadius: j == numRings - 1 ? diagramRadius : getInnerRadius(diagramRadius, numRings, j + 1), color: self.getAttribute('fill')};
                            _.extend(d.arc, categoryArcs[d.label]);
                            return d;
                        })
                        .attr("d", function (d) {
                            return arc.innerRadius(d.arc.innerRadius).outerRadius(d.arc.outerRadius)(d.arc);
                        })
                        /* show/hide the truncated text*/
                        .on('mouseover', function (d) {
                            if (!scope.viewTech) {
                                d.active = true;
                                //$rootScope.$broadcast("setActiveTab", d.label);
                                redrawTechCircles();
                            }
                        })
                        .on('mouseout', function (d) {
                            if (!scope.viewTech) {
                                d.active = false;
                                redrawTechCircles();
                            }

                        });


                    /**
                     * nodeStatusEnter --> 4 elements for Adpot,Trial,Assess,Hold
                     * nodeCategoryEnter --> each of the nodeStatusEnter will have 4 category items
                     * 4 svg elements with class tech is formed , inside each tech 4 category is formed
                     * each categoery has an element for the item it has
                     */

                    var nodeStatusEnter = svgNodes.selectAll("g").data(scope.techList).enter().append("g").attr("class", "tech");

                    var nodeCategoryEnter = nodeStatusEnter.selectAll("g")
                        .data(function (d) {
                            return d.categories;
                        })
                        .enter()
                        .append("g")
                        .datum(function (category, categoryIndex) {
                            var self = this;
                            //category.color = colorFiveGroupsOfSeven(7 * categoryIndex + 6);
                            category.color = self.__data__.arc.color;
                            return category;
                        })
                        .attr("class", "category");

                    /**
                     *  for label truncation
                     */
                    var technologies;
                    var truncatedLabelLength = 15;

                    function getTechLabelSubstring(label) {
                        return (label.length <= truncatedLabelLength) ?
                            label :
                            label.substring(0, truncatedLabelLength - 1) + "...";
                    }

                    /**
                     * for radar drawing
                     * for each of the technologies add tech-label
                     */
                    function drawTech() {
                        technologies = nodeCategoryEnter.selectAll("g")
                            .data(function (d) {
                                return d.technologies;
                            }, function (d) {
                                return d.label;
                            });

                        //$log.info("Redrawing");

                        var techEnter = technologies.enter().append("g").attr("class", "tech-label")
                            .on('mouseover', function (d) {
                                if (!scope.viewTech) {
                                    d.active = true;
                                    scope.setVariables('activeTechLabel', d.label);
                                    this.parentNode.__data__.active = true;
                                    var tech_data = {    'label': d.label,
                                        'description': d.description,
                                        'color': this.parentNode.__data__.color
                                    };
                                    scope.setVariables('tech_data', tech_data);
                                    // Fade all the segments.
                                    d3.selectAll("text")
                                        .style("opacity", 0.3);
                                    d3.selectAll("circle")
                                        .style("opacity", 0.3);
                                    d3.selectAll("text").filter(function (node) {
                                        if (node.label == scope.activeTechLabel) {
                                            return true;
                                        }
                                    }).style("opacity", 1).style('font-weight', 'bold').style('cursor', 'pointer');
                                    d3.selectAll("circle").filter(function (node) {
                                        if (node.label == scope.activeTechLabel) {
                                            return true;
                                        }
                                    }).style("opacity", 1);
                                }

                                redrawTechCircles();
                            })
                            .on('mouseout', function (d) {

                                if (!scope.viewTech) {
                                    d.active = false;
                                    scope.setVariables('tech_data', {});
                                    // Fade all the segments.
                                    d3.selectAll("text")
                                        .style("opacity", 1).style('font-weight', 'normal').style('cursor', 'default');
                                    scope.hideLables();
                                    //scope.closeInfo();
                                }

                                redrawTechCircles();
                            }).on('click', function (d) {
                                scope.setVariables('viewTech', true);
                                var tech_data = {
                                    'status': this.parentElement.parentNode.__data__.label,
                                    'category': this.parentElement.__data__.label,
                                    'tech': {
                                        'label': d.label,
                                        'description': d.description
                                    }

                                };
                                $rootScope.$broadcast("setActiveTab", this.parentElement.parentElement.__data__);
                                $rootScope.$broadcast("showInfo", this.parentElement.parentElement.__data__, d);
                                tooltip.style("visibility", "visible");
                                tooltip.style("opacity", "1");
                                tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX -200) + "px");
                                tooltip.html('<div class="panel panel-primary"><div class="panel-heading text-center">'
                                        + d.label
                                        + '<i class="fa fa-times pull-right" ng-click="closeInfo()"></i></div>'
                                        + '<div class="panel-body">'
                                        + '<label>Status : </label> <label style="color:'
                                        + this.parentElement.__data__.color + ';"> '
                                        + this.parentElement.parentElement.__data__.label + '</label><br>'
                                        + '<label> Description : </label> <span>'
                                        + $sce.trustAsHtml(d.description)
                                        + '</span></div></div>'
                                );
                                $('div.tooltip i').on('click', function () {
                                        tooltip.style('visibility', 'hidden');
                                    d3.selectAll("text")
                                        .style("opacity", 1).style('font-weight', 'normal').style('cursor', 'default');
                                    scope.viewTech = false;
                                });

                                //scope.showInfoModal(tech_data, true);
                            });

                        techEnter.append("text")
                            .datum(function (d) {
                                var parentData = d3.select(this.parentNode.parentNode).datum();
                                while (!d.x || !d.y || isOverlappingAnotherPoint(d)) {
                                    applyRandomXY(parentData.arc, d);
                                }
                                return d;
                            })
                            .text(function (d) {
                                return getTechLabelSubstring(d.label);
                            })
                            .attr("x", function (d) {
                                return d.x + defaultTechRadius + 5;
                            })
                            .attr("y", function (d) {
                                return d.y + 3.5;
                            });

                        techEnter.append("circle").attr("r", defaultTechRadius)
                            .style("stroke", "grey")
                            .style("fill", "whitesmoke")
                            .attr("cx", function (d) {
                                return d.x;
                            }).attr("cy", function (d) {
                                return d.y;
                            });
                        technologies.exit().remove();
                    }


                    /**
                     * label and full radar diagram
                     */



                    scope.$watch('techList', function () {
                        drawTech();
                        scope.displayLabels();
                    }, true);

                    drawTech();

                    function interpolateText(string, initialLength) {
                        return function (t) {
                            return t == 0 ? getTechLabelSubstring(string) : string.substring(0, Math.round((string.length - initialLength) * t) + initialLength);
                        };
                    }

                    function reverseInterpolateText(string, initialLength) {
                        return function (t) {
                            var charsToRemove = t * (string.length - initialLength);
                            return t == 1 ? getTechLabelSubstring(string) : string.substring(0, string.length - charsToRemove);
                        };
                    }

                    /**
                     *  truncated text next to the items
                     */
                    function redrawTechCircles() {
                        scope.$apply();

                        technologies.selectAll("text").transition()
                            .duration(150)
                            .tween("text", function (d) {
                                var interpolationFunction = d.active ? interpolateText : reverseInterpolateText;
                                var i = interpolationFunction(d.label, Math.min(this.textContent.length, truncatedLabelLength));
                                if (i(1) !== this.textContent) {
                                    return function (t) {
                                        this.textContent = i(t);
                                    };
                                }
                            });


                        technologies.selectAll("circle").transition()
                            .duration(500)
                            .attr("r", function (d) {
                                return d.active ? hoverTechRadius : (d.radius ? d.radius : defaultTechRadius);
                            });
                    }

                };
                init();
                scope.$on("redraw", function (event, args) {
                    $log.info(' Redraw Triggered');
                    init();
                });


            }//link end
        }
    }]);