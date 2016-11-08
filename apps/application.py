from apps.app_config import db_session

__author__ = "Ashwini Chandrasekar(@sriniash)"
__email__ = "ASHWINI_CHANDRASEKAR@homedepot.com"
__version__ = "1.0"
__doc__ = "Main Application file where all the API's are defined"

from flask import Flask, request
from flask.templating import render_template
from flask.wrappers import Response
import logging, json, sys

from apps.radarDBQuery import create_table,get_group_id, update_technology_group, add_technology_group, get_technology_list, \
    delete_technology_group, get_groups_list, add_groups, delete_groups


'''
 app config and initialization
'''
app = Flask(__name__)

app.config.from_object('apps.app_config')

'''
    Logging
'''
logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)
log = logging.getLogger()

'''
  Called only once - remove after final implementation in cloud with proper db
'''


@app.route('/table')
def tables():
    create = create_table()
    resp = Response(response=json.dumps({'msg': create}),
                    status=200,
                    mimetype="application/json")
    return resp


@app.route('/')
def index():
    return render_template('index.html')


'''
    technology  create technology
    -- json input
    {
      "technology":"Angular",
      "status":"Adopt",
      "group": "Devops",
      "category" :"Languages",
      "description": "TEST"
    }
    technology update
     -- tech and group will not change and update flag is used for the same
'''


@app.route('/technology', methods=['POST', 'GET'])
def add_tech():
    try:
        if request.method == 'POST':
            tech_json = request.json
            update = request.args.get('update')
            log.info('Group -- {0}'.format(tech_json['group']))
            group = tech_json['group']

            group_id = get_group_id(group)
            log.info('Group ID-- {0}'.format(group_id))

            if update and update is not None:
                tech = update_technology_group(tech_json, group_id)

            else:
                tech = add_technology_group(tech_json, group_id)

            status = 200
            response = {
                'message': 'Technology has been added/updated'
            }
        else:
            group = request.args.get('group')
            log.info('Group -- {0}'.format(group))

            group_id = get_group_id(group)
            log.info('Group ID-- {0}'.format(group_id))

            if group_id is not None:
                tech_list = get_technology_list(group_id)
                log.info('tech_list -- {0}'.format(tech_list))

                response = {
                    'tech_list': tech_list
                }
            else:
                response = {
                    'tech_list': []
                }
            status = 200

    except Exception as e:
        log.error('Error in technology {0}'.format(e))
        status = 500
        response = {
            'message': str(e)
        }

    resp = Response(response=json.dumps(response),
                    status=status,
                    mimetype="application/json")
    return resp


'''
    Technology delete
      -- json  input
      {
          "technology":"Angular",
          "group": "Devops"
      }
'''


@app.route('/technology/delete', methods=['POST'])
def delete_tech():
    try:
        tech_json = request.json
        group = tech_json['group']
        technology = tech_json['technology']
        log.info('Tech sent -- {0}'.format(tech_json))
        group_id = get_group_id(group)
        log.info('Group ID-- {0}'.format(group_id))

        tech = delete_technology_group(technology, group_id)

        log.info('tech for deleting -- {0}'.format(tech))

        status = 200
        response = {
            'message': 'Technology has been Deleted'
        }

    except Exception as e:
        log.error('Error in deleting technology  -- {0}'.format(e))
        status = 500
        response = {
            'message': str(e)
        }

    resp = Response(response=json.dumps(response),
                    status=status,
                    mimetype="application/json")
    return resp


'''
  list of groups
   returns list of distinct groups with GET
   with POST : {groups: ["TEST", "TESTGROUP"]} as JSON input it will create the groups
'''


@app.route('/groups', methods=['POST', 'GET'])
def list_group():
    if request.method == 'GET':
        try:
            groups = get_groups_list()
            status = 200
            response = {
                'group_list': groups
            }

        except Exception as e:
            log.error('Error in getting  group List -- {0}'.format(e))
            status = 500
            response = {
                'message': str(e)
            }
    else:
        try:

            groups = request.json['groups']
            group_list = get_groups_list()
            group_add = add_groups(groups)

            status = 200
            response = {
                'message': ' Groups Created'
            }
        except Exception as e:
            log.error('Error in creating  group List -- {0}'.format(e))
            status = 500
            response = {
                'message': str(e),
                'groups_list': group_list
            }

    resp = Response(response=json.dumps(response),
                    status=status,
                    mimetype="application/json")
    return resp


'''

  Input :
  {groups: "testgroup"}
'''


@app.route('/groups/delete', methods=['POST'])
def delete_group():
    try:
        group_name = request.json['groups'].lower()
        log.info(group_name)
        group_list = get_groups_list()

        group = delete_groups(group_name)
        status = 200
        response = {
            'message': ' Groups Deleted'
        }
    except Exception as e:
        log.error('Error in deleting  group List -- {0}'.format(e))
        status = 500
        response = {
            'message': str(e),
            'groups_list': group_list
        }

    resp = Response(response=json.dumps(response),
                    status=status,
                    mimetype="application/json")
    return resp


@app.teardown_appcontext
def shutdown_session(exception=None):
    log.info('----------------- IN Shutdown session --------------')
    db_session.remove()
    log.info('----------------- AFter RemoveShutdown session --------------')
