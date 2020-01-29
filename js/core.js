function Table(p) {
  var that = this,
    localData,
    visible_rows = [],
    json,
    page_from = 0,
    page_to = p.perPage;
  this.idTable = $("#" + p.id);
  this.idHeader = $("#" + p.idHeader);
  this.idPagination = p.idPagination;
  this.itemsPerPage = p.perPage || 7;
  this.currentPage = 1;
  this.pages = 0;

  (this.init = function() {
    //this.clearLocalStorage();
    this.loadData();

    $("#s").on("keyup", function() {
      var inputValue = $("#s")
        .val()
        .toLowerCase();
      json = JSON.parse(localData);

      if (inputValue) {
        json = that.search(
          json,
          document.getElementById("s_field").value,
          inputValue
        );
      }

      that.showData(0, that.itemsPerPage, json);
      that.showPageNav(json, that.idPagination);
    });

    $("#" + this.idPagination).on("click", ".pg", function() {
      var a = $(this),
        number = a.data("number");
      if (!a.hasClass("active")) {
        that.showRecords(number);
      }
      return false;
    });

    $("#" + this.idPagination).on("click", ".prev", function() {
      that.prev();
      return false;
    });

    $("#" + this.idPagination).on("click", ".next", function() {
      that.next();
      return false;
    });

    this.idHeader.on("click", "th", function() {
      var a = $(this),
        value = a.attr("value");

      a.siblings().removeClass("active");

      if (a.hasClass("active")) {
        a.removeClass("active");
        if (value == "id") that.sortById("DESC");
        else if (value == "sdate") that.sortByDate();
        else that.sortByString("ASC", value);
      } else {
        a.addClass("active");
        if (value == "id") that.sortById("ASC");
        else if (value == "sdate") that.sortByDate("ASC");
        else that.sortByString("DESC", value);
      }
      that.showData(page_from, that.itemsPerPage, json);
      that.showRecords(that.currentPage);
      return false;
    });

    $("#toggle_form label").on("click", function() {
      var elem = $("#toggle_form label input"),
        opt;

      that.showData(page_from, page_to, json);
      that.showHeader();
      visible_rows = [];

      for (var i = 0; i < elem.length; i++) {
        if (elem[i].checked) {
          visible_rows.push(elem[i].value);
        }
      }

      for (var l = 0; l < visible_rows.length; l++) {
        opt +=
          "<option value='" +
          visible_rows[l] +
          "'>" +
          visible_rows[l] +
          "</option>";
      }
      document.getElementById("s_field").innerHTML = opt;
    });
  }),
    (this.loadData = function() {
      $.getJSON("https://api.myjson.com/bins/6p1z2", function(data) {
        localStorage.setItem("array", JSON.stringify(data));
      })
        .done(function() {
          console.log("done - success");

          that.showData(0, that.itemsPerPage);
          that.showHeader();
          that.showPageNav(json, that.idPagination);
        })
        .fail(function() {
          console.log("error");
        })
        .always(function() {
          console.log("complete");
        });
    }),
    (this.showData = function(page_from, page_to, obj) {
      var tr,
        tr_title,
        elem = $("#toggle_form label input");

      localData = localStorage.getItem("array");
      visible_rows = [];

      for (var i = 0; i < elem.length; i++) {
        if (elem[i].checked) {
          visible_rows.push(elem[i].value);
        }
      }

      if (!obj) {
        json = JSON.parse(localData);
      } else {
        if (obj == "") this.idTable.html("");
        json = obj;
      }

      if (page_to > json.length) {
        page_to = json.length;
      }

      for (var i = page_from; i < page_to; i++) {
        tr += "<tr>";
        for (var j = 0; j < visible_rows.length; j++) {
          tr += "<td>" + json[i][visible_rows[j]] + "</td>";
        }
        tr += "</tr>";
      }
      this.idTable.html(tr);
    }),
    (this.showHeader = function() {
      var tr_title;
      for (var k = 0; k < visible_rows.length; k++) {
        tr_title +=
          "<th value='" + visible_rows[k] + "'>" + visible_rows[k] + "</th>";
      }
      this.idHeader.html("<tr>" + tr_title + "</tr>");
    }),
    (this.search = function(obj, key, val) {
      var results = [];
      results = obj.filter(function(entry) {
        if (key == "id") {
          return parseInt(entry[key]) == parseInt(val);
        } else {
          return entry[key].toUpperCase().indexOf(val.toUpperCase()) != -1;
        }
      });
      return results;
    }),
    (this.showPageNav = function(json, pagerName) {
      var element = document.getElementById(pagerName),
        records = json.length - 1,
        pagerHtml,
        page;
      if (records > this.itemsPerPage) {
        this.pages = Math.ceil(records / this.itemsPerPage);
        pagerHtml = '<span  class="prev"> &#171  </span>';
        for (page = 1; page <= this.pages; page++)
          pagerHtml +=
            '<span id="pg' +
            page +
            '"  data-number=' +
            page +
            ' class="pg" >' +
            page +
            "</span>  ";
        pagerHtml += '<span class="next">  &#187; </span>';
        element.innerHTML = pagerHtml;
        element.getElementsByClassName("pg")[0].className += " active";
      } else {
        element.innerHTML = "";
      }
      this.showRecords(1);
    }),
    (this.prev = function() {
      if (this.currentPage > 1) this.showRecords(this.currentPage - 1);
    }),
    (this.next = function() {
      if (this.currentPage < this.pages) this.showRecords(this.currentPage + 1);
    }),
    (this.showRecords = function(pageNumber) {
      page_from = (pageNumber - 1) * this.itemsPerPage;
      this.currentPage = pageNumber;
      page_to = page_from + this.itemsPerPage;
      this.showData(page_from, page_to, json);
      $("#" + this.idPagination + " .pg")
        .removeClass("active")
        .eq(pageNumber - 1)
        .addClass("active");
    }),
    (this.sortById = function(type) {
      if (type == "DESC")
        json.sort(function(a, b) {
          return parseFloat(a.id) - parseFloat(b.id);
        });
      else
        json.sort(function(a, b) {
          return parseFloat(b.id) - parseFloat(a.id);
        });
    }),
    (this.sortByString = function(type, property) {
      if (type == "ASC") {
        json.sort(function(a, b) {
          var x = a[property].toUpperCase(),
            y = b[property].toUpperCase();
          return x < y ? -1 : x > y ? 1 : 0;
        });
      } else {
        json.sort(function(a, b) {
          var x = a[property].toUpperCase(),
            y = b[property].toUpperCase();
          return y < x ? -1 : y > x ? 1 : 0;
        });
      }
    }),
    (this.sortByDate = function(type) {
      if (type == "ASC") {
        json.sort(function(a, b) {
          var x = a["sdate"]
              .split("/")
              .reverse()
              .join(),
            y = b["sdate"]
              .split("/")
              .reverse()
              .join();
          return x < y ? -1 : x > y ? 1 : 0;
        });
      } else {
        json.sort(function(a, b) {
          var x = a["sdate"]
              .split("/")
              .reverse()
              .join(),
            y = b["sdate"]
              .split("/")
              .reverse()
              .join();
          return y < x ? -1 : y > x ? 1 : 0;
        });
      }
    }),
    (this.clearLocalStorage = function() {
      localStorage.removeItem("array");
    });
}
