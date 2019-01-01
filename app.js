import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/YouTube.sqlite"
db = SQLAlchemy(app)

"""" reflect an existing database into a new model"""""
Base = automap_base()
"""reflect the tables"""
Base.prepare(db.engine, reflect=True)

@app.route("/")
def index():
    """Return the homepage."""
    '''return render_template("index.html")
    return "Helloooo"

@app.route("/categories")
def names():
    '''Return a list of earnings based on views.'''

    '''Use Pandas to perform the sql query'''
    category = db.session.query(Summary).category
    summary = pd.read_sql_query(category, db.session.bind)

   '''Return a list of the column names (sample names)'''
    return jsonify(list(summary.columns)[1:])
    
    
    
@app.route("/metadata/<category>")
def metadata(category):
    '''Return the MetaData for a given category.'''
    sel = [
        summary.Category,
        summary.Monthly_Earnings,
        summary.Views,
        summary.Subscribers,
        summary.Uploads,
        
    ]

    results = db.session.query(*sel).filter(summary.Category == category).all()
    """Create a dictionary entry for each row of metadata information"""
    youtube_metadata = {}
    for result in results:
        summary["category"] = result[0]
        summary["Monthly_Earnings"] = result[1]
        summary["Subscribers"] = result[2]
        summary["Views"] = result[3]
        summary["Uploads"] = result[4]
        

    print( youtube_metadata)
    return jsonify( youtube_metadata)


 if __name__ == '__main__':
    app.run(debug=True)
