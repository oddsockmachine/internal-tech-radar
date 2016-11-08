__author__ = "Ashwini Chandrasekar(@sriniash)"
__email__ = "ASHWINI_CHANDRASEKAR@homedepot.com"
__version__ = "1.0"
__doc__ = "DB query made from here"

import json
from apps.models import Groups, Technology, AlchemyEncoder
from apps.app_config import db_session

def create_table():
    db_session.create_all()
    return True


'''
    get a group when id is passed

'''


def get_group_id(group_name):
    groups = Groups.query.filter_by(group=group_name).first().id

    return groups


'''
    List of groups
'''


def get_groups_list():
    group_list = db_session.query(Groups.group).all()
    groups = []
    for group in group_list:
        groups.append(group[0])

    return groups


'''
    Add of groups
'''


def add_groups(groups):
    for group in groups:
        group_name = Groups(group.lower())
        db_session.add(group_name)
    db_session.commit()
    return groups


'''
    Delete of groups
'''


def delete_groups(group_name):
    group = Groups.query.filter_by(group=group_name).first()
    db_session.delete(group)
    db_session.commit()
    return group


'''
    get technology when group id is passed
'''


def get_technology_by_group(technology, group_id):
    tech = Technology.query.filter_by(technology=technology, group=group_id).first()

    return tech


'''
    Update technology
'''


def update_technology_group(technology, group_id):
    tech = get_technology_by_group(technology['technology'], group_id)
    tech.category = technology['category']
    tech.status = technology['status']
    tech.description = technology['description']
    db_session.commit()

    return tech


'''
    add technology
'''


def add_technology_group(technology, group_id):
    tech = Technology(technology['technology'], technology['category'], \
                      technology['status'], group_id, technology['description'])

    db_session.add(tech)
    db_session.commit()

    return tech


'''
    delete technology
'''


def delete_technology_group(technology, group_id):
    tech = get_technology_by_group(technology, group_id)

    db_session.delete(tech)
    db_session.commit()

    return tech


'''
    get list of technologies for a group
'''


def get_technology_list(group_id):
    tech_list = Technology.query.filter_by(group=group_id).all()

    json_data = [
        {
            "label": "Adopt",
            "categories": [
                {
                    "label": "Tools",
                    "technologies": []
                },
                {
                    "label": "Techniques",
                    "technologies": []
                },
                {
                    "label": "Platforms",
                    "technologies": []
                },
                {
                    "label": "Languages",
                    "technologies": []
                }
            ]
        },
        {
            "label": "Trial",
            "categories": [
                {
                    "label": "Tools",
                    "technologies": []
                },
                {
                    "label": "Techniques",
                    "technologies": []
                },
                {
                    "label": "Platforms",
                    "technologies": []
                },
                {
                    "label": "Languages",
                    "technologies": []
                }
            ]
        },
        {
            "label": "Assess",
            "categories": [
                {
                    "label": "Tools",
                    "technologies": []
                },
                {
                    "label": "Techniques",
                    "technologies": []
                },
                {
                    "label": "Platforms",
                    "technologies": []
                },
                {
                    "label": "Languages",
                    "technologies": []
                }
            ]
        },
        {
            "label": "Hold",
            "categories": [
                {
                    "label": "Tools",
                    "technologies": []
                },
                {
                    "label": "Techniques",
                    "technologies": []
                },
                {
                    "label": "Platforms",
                    "technologies": []
                },
                {
                    "label": "Languages",
                    "technologies": []
                }
            ]
        }
    ]

    for tech in tech_list:
        tech_data = json.loads(json.dumps(tech, cls=AlchemyEncoder))
        for status in json_data:
            if status['label'] == tech_data['status']:
                for category in status['categories']:
                    if category['label'] == tech_data['category']:
                        tech_cat_data = dict()
                        tech_cat_data['label'] = tech_data['technology']
                        tech_cat_data['description'] = tech_data['description']
                        category['technologies'].append(tech_cat_data)

    return json_data
