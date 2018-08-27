#!/usr/bin/python

import os
import json

GROUP_DONE = False
ONE_DONE = False
DATA = []

# FNAME = ""
# LNAME = ""
# PHOTO = ""
# QUOTE = ""
# SONG = ""
# PART = ""
# YEAR = ""
# MAJOR =

while not GROUP_DONE:
    GROUP_DONE_I = raw_input("Is group done? (y/n): ")
    if GROUP_DONE_I == "y":
        GROUP_DONE = True
        ONE_DONE = True
    if GROUP_DONE_I == "n":
        GROUP_DONE = False
        ONE_DONE = False

    if not ONE_DONE:
        FNAME = raw_input("Enter your first name (Case Sensitive): ")
        print FNAME
        LNAME = raw_input("Enter your last name (Case Sensitive): ")
        print LNAME
        PHOTO = "images/members/" + FNAME.lower() + LNAME.lower() + ".jpg"
        print PHOTO
        QUOTE = raw_input("Enter a quote in the form: ('Hello' - Me): ")
        print QUOTE
        SONG = raw_input("Enter your favorite song in the form (Title - Artist): ")
        print SONG

        ONEBOARD_I = "sentinel"

        while ONEBOARD_I != "y" and ONEBOARD_I != "n":
            print "\nPlease type either y or n"
            ONEBOARD_I = raw_input("Are you on Eboard?: ")
            print ONEBOARD_I
        if ONEBOARD_I == "y":
            ONEBOARD = True
            TITLE = raw_input("What is your position? (Case Sensitive): ")
        if ONEBOARD_I == "n":
            ONEBOARD = False
            TITLE = ""

        PART = raw_input("Enter your voice part in the form (T1): ")
        YEAR = raw_input("Enter your graduation year in the form (2019): ")
        MAJOR = raw_input("Enter your Major(s) in the form (Computer Science, Music) or (Computer Science): ")

        FB_I = "sentinel"

        while FB_I != "y" and FB_I != "n":
            print "\nPlease type either y or n"
            FB_I = raw_input("Do you want your Facebook linked?: ")
        if FB_I == "y":
            FB = True
            FBL = raw_input("What is your profile ID? ex: (kennedybaile): ")
        else:
            FB = False
            FBL = ""

        IG_I = "sentinel"

        while IG_I != "y" and IG_I != "n":
            print "\nPlease type either y or n"
            IG_I = raw_input("Do you want your Instagram linked?: ")
        if IG_I == "y":
            IG = True
            IGL = raw_input("What is your instagram handle? ex: (kennedygbailey): ")
        else:
            IG = False
            IGL = ""

        SC_I = "sentinel"

        while SC_I != "y" and SC_I != "n":
            print "\nPlease type either y or n"
            SC_I = raw_input("Do you want your Snapchat linked?: ")
        if SC_I == "y":
            SC = True
            SCL = raw_input("What is your Snap username? ex: (kenkennedy97): ")
        else:
            SC = False
            SCL = ""

        SCLD_I = "sentinel"

        while SCLD_I != "y" and SCLD_I != "n":
            print "\nPlease type either y or n"
            SCLD_I = raw_input("Do you want your Soundcloud linked?: ")
        if SCLD_I == "y":
            SCLD = True
            SCLDL = raw_input("What is your profile ID? ex: (kennedy-bailey-612002265): ")
        else:
            SCLD = False
            SCLDL = ""



        print "\n\nYou entered: "

        print "Name: " + FNAME + " " + LNAME
        print "Quote: " + QUOTE
        if ONEBOARD:
            print "Eboard Position: " + TITLE
        print "Part: " + PART
        print "Major, Grad Year: " + MAJOR + ", " + YEAR
        if FB:
            print "Facebook ID: " + FBL
        if IG:
            print "Instagram handle: " + IGL
        if SC:
            print "Snapchat username: " + SCL
        if SCLD:
            print "Souncloud ID: " + SCLDL

        ISCORRECT = "sentinel"

        while ISCORRECT != "y" and ISCORRECT != "n":
            print "\nPlease type either y or n"
            ISCORRECT = raw_input("Is the above information correct? ")
        if ISCORRECT == "y":
            ONE_DONE = True
            print "\nThank You!"
        if ISCORRECT == "n":
            ONE_DONE = False
            print "\nTry Again"
            
        JSON = {
            'fname': FNAME,
            'lname': LNAME,
            'photo': PHOTO,
            'quote': QUOTE,
            'song': SONG,
            'onEboard': ONEBOARD,
            'title': TITLE,
            'part': PART,
            'year': YEAR,
            'major': MAJOR,
            'fb': FB,
            'ig': IG,
            'sc': SC,
            'scld': SCLD,
            'fbl': FBL,
            'igl': IGL,
            'scl': SCL,
            'scldl': SCLDL
        }
        DATA.append(JSON)
        print DATA
        # add json data to list


print DATA

with open('data.json', 'w') as outfile:
    json.dump(DATA, outfile);
