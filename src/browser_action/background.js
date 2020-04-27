/**
 * Created by PhpStorm.
 * User: INDRANIL
 * Date: 01-09-2019
 * Time: 16:50
 */
var UPDATE_INTERVAL = 3;

var TYPE = {
   today: "today",
   average: "average",
   all: "all"
};

//current
var mode = TYPE.today;

setDefaults();

function setDefaults() {

   if (!localStorage["blacklist"]) {
      localStorage["blacklist"] = JSON.stringify(["example.com"]);
   }

   if (!localStorage["num_days"]) {
      localStorage["num_days"] = 1;
   }

   if (!localStorage["date"]) {
      localStorage["date"] = new Date().toLocaleDateString();
   }

   //console.log(localStorage["date"]);
   if (!localStorage["domains"]) {
      localStorage["domains"] = JSON.stringify({});
   }

   if (!localStorage["total"]) {
      localStorage["total"] = JSON.stringify({
         today: 0,
         all: 0
      });
   }


   if (!localStorage["chart_limit"]) {
      localStorage["chart_limit"] = 7;
   }


   if (!localStorage["other"]) {
      localStorage["other"] = JSON.stringify({
         today: 0,
         all: 0
      });
   }
}



function combineEntries(threshold) {
   var domains = JSON.parse(localStorage["domains"]);
   var other = JSON.parse(localStorage["other"]);

   if (Object.keys(domains).length <= threshold) {
      return;
   }


   var data = [];
   for (var domain in domains) {
      var domain_data = JSON.parse(localStorage[domain]);
      data.push({
         domain: domain,
         all: domain_data.all
      });
   }
   data.sort(function (a, b) {
      return b.all - a.all;
   });

   for (var i = threshold; i < data.length; i++) {
      other.all += data[i].all;
      var domain = data[i].domain;
      delete localStorage[domain];
      delete domains[domain];
   }
   localStorage["other"] = JSON.stringify(other);
   localStorage["domains"] = JSON.stringify(domains);
}


function checkDate() {
   var todayStr = new Date().toLocaleDateString();
   var saved_day = localStorage["date"];

   if (saved_day !== todayStr) {
      // console.log(todayStr);
      var domains = JSON.parse(localStorage["domains"]);
      for (var domain in domains) {
         var domain_data = JSON.parse(localStorage[domain]);
         domain_data.today = 0;
         localStorage[domain] = JSON.stringify(domain_data);
      }
      // Reset total for today
      var total = JSON.parse(localStorage["total"]);
      total.today = 0;
      localStorage["total"] = JSON.stringify(total);

      //Combine domains
      combineEntries(500);
      // Keep track of number of days web timer has been used
      localStorage["num_days"] = parseInt(localStorage["num_days"]) + 1;
      // Update date
      localStorage["date"] = todayStr;
   }
}

// url extrctor and modifier
function extractDomain(url) {
   var re = /:\/\/(www\.)?(.+?)\//;
   return url.match(re)[2];
}

function inBlacklist(url) {
   if (!url.match(/^http/)) {
      return true;
   }
   var blacklist = JSON.parse(localStorage["blacklist"]);
   for (var i = 0; i < blacklist.length; i++) {
      if (url.match(blacklist[i])) {
         return true;
      }
   }
   return false;
}


function updateData() {
   //
   chrome.idle.queryState(30, function (state) {
      if (state === "active") {

         chrome.tabs.query({ 'lastFocusedWindow': true, 'active': true }, function (tabs) {
            if (tabs.length === 0) {
               return;
            }
            var tab = tabs[0];

            checkDate();
            if (!inBlacklist(tab.url)) {

               var domain = extractDomain(tab.url);
               var domains = JSON.parse(localStorage["domains"]);

               /*var domain_data= JSON.parse(localStorage[domain]);
               domain_data.today = 0;
               localStorage[domain]= JSON.stringify(domain_data);*/
               //console.log(domain_data)

               if (!(domain in domains)) {
                  // fix it
                  domains[domain] = 1;
                  localStorage["domains"]= JSON.stringify(domains);
               }
               var domain_data;
               if (localStorage[domain]) {
                  domain_data = JSON.parse(localStorage[domain]);
               } else {
                  domain_data= {
                     today: 0,
                     all: 0
                  };
               }
               domain_data.today += UPDATE_INTERVAL;
               domain_data.all += UPDATE_INTERVAL;

               localStorage[domain] = JSON.stringify(domain_data);
               // Update total time
               var total = JSON.parse(localStorage["total"]);
               total.today += UPDATE_INTERVAL;
               total.all += UPDATE_INTERVAL;
               localStorage["total"] = JSON.stringify(total);
               // Console.log(localStorge["total"]);
               // current site
               var num_min = Math.floor(domain_data.today / 60).toString();
               if (num_min.length < 4) {
                  num_min += "m";
               }
               chrome.browserAction.setBadgeText({
                  text: num_min
               });
            } else {

               chrome.browserAction.setBadgeText({
                  text: ""
               });
            }
         });
      }
   });
}
// Main update  calling function
setInterval(updateData, UPDATE_INTERVAL * 1000);
