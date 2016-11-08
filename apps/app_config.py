__author__ = "Ashwini Chandrasekar(@sriniash)"
__email__ = "ASHWINI_CHANDRASEKAR@homedepot.com"
__version__ = "1.0"
__doc__ = "Application db config"

import os, json

from sqlalchemy.engine import create_engine
from sqlalchemy.ext.declarative.api import declarative_base
from sqlalchemy.orm.scoping import scoped_session
from sqlalchemy.orm.session import sessionmaker
from sqlalchemy.pool import NullPool

'''
Pivotal Cloud Foundry configuration:
'''
vcap_config = os.environ.get('VCAP_SERVICES')

if vcap_config:
    decoded_config = json.loads(vcap_config)
    for key, value in decoded_config.iteritems():
        if key.startswith('p-mysql'):
            mysql_creds = decoded_config[key][0]['credentials']
        elif key.startswith('cleardb'):
            mysql_creds = decoded_config[key][0]['credentials']
    if 'mysql_creds' in locals():
        mysql_host = mysql_creds['hostname']
        mysql_port = int(mysql_creds['port'])
        mysql_username = mysql_creds['username']
        mysql_password = mysql_creds['password']
        mysql_db = mysql_creds['name']
        mysql_url = str(mysql_creds['uri'])
        SQLALCHEMY_DATABASE_URI = 'mysql://' + mysql_username + ':' + mysql_password + '@' + mysql_host + ':' + str(mysql_port) + '/' + mysql_db
else:
    # local sqllite file-based DB
    file_path = os.path.abspath(os.getcwd()) + "/apps/data/devtools.db"
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + file_path
    SQLALCHEMY_RECORD_QUERIES = True

'''
  SQL DB
# SQLALCHEMY_DATABASE_URI = 'mysql://username:password@ip-address/db_name'
'''

engine = create_engine(SQLALCHEMY_DATABASE_URI, poolclass=NullPool)

db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()
