"use strict";
const settings = require("./../package.json").settings;
const debug = settings.debug === true;
if (!debug) {
    console.log("Need to be in a debug environnment to run tests.");
    return;
}

const tape = require("tape");
const random = require("./../debug/geometry2d");

tape("Test", t => {
    t.plan(0);
});
