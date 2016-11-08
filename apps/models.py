
__author__    =	"Ashwini Chandrasekar(@sriniash)"
__email__     =	"ASHWINI_CHANDRASEKAR@homedepot.com"
__version__   =	"1.0"
__doc__       = "Models relating to the DB tables"

import json

from sqlalchemy.ext.declarative.api import DeclarativeMeta
from apps.app_config import Base

from sqlalchemy import Column
from sqlalchemy.sql.sqltypes import Integer, String, Text


'''
   Models :
     Technology Table with : ID, technology, category,status,description and group
'''


class Technology(Base):
    __tablename__ ='technology'
    id = Column(Integer, primary_key=True)
    technology = Column(String(120))
    category = Column(String(120))
    status = Column(String(120))
    group = Column(Integer)
    description = Column(Text)

    def __init__(self, technology, category, status, group, description):
        self.technology = technology
        self.category = category
        self.status = status
        self.group = group
        self.description = description

    def __repr__(self):
        return '<Technology %r>' % self.technology


'''
  Groups table whose id is used in Technology table
'''


class Groups(Base):
    __tablename__='groups'
    id = Column(Integer, primary_key=True)
    group = Column(String(120), unique=True)

    def __init__(self, group):
        self.group = group

    def __repr__(self):
        return '<Group %r>' % self.group


class AlchemyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj.__class__, DeclarativeMeta):
            # an SQLAlchemy class
            fields = {}
            for field in [x for x in dir(obj) if not x.startswith('_') and x != 'metadata']:
                data = obj.__getattribute__(field)
                try:
                    json.dumps(data)  # this will fail on non-encodable values, like other classes
                    fields[field] = data
                except TypeError:
                    fields[field] = None
            # a json-encodable dict
            return fields

        return json.JSONEncoder.default(self, obj)





