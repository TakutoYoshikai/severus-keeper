const express = require("express");
const keep = require("ipfs-keep");
const cron = require("node-cron");

function Server() {
  const that = this;
  this.cids = [];
  const app = express();
  app.get("/:cid", (req, res) => {
    const cid = req.params.cid;
    if (!(cid in this.cids)) {
      this.cids.push(cid);
    }
  });
  this.app = app;
  this.task = null;
  this.startCron = function() {
    if (this.task !== null) {
      throw new Error("Cron is already started");
    }
    this.task = cron.schedule("0 0 0 1 * *", () => {
      keep(that.cids);
    });
  }
  this.stopCron = function() {
    if (this.task === null) {
      return;
    }
    this.task.stop();
    this.task = null;
  }
}

module.export = Server;
