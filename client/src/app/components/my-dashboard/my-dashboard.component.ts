import { Component, OnInit, NgZone } from '@angular/core';
import { WeekService } from 'src/app/services/week.service';
import { AuthService } from 'src/app/services/auth.service';
/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-my-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.css']
})
export class MyDashboardComponent implements OnInit {
  user;
  dataGraph = [
    { country: 'משמרת א', litres: 0 },
    { country: 'משמרת ב', litres: 0 },
    { country: 'משמרת ג', litres: 0 }];



  constructor(
    private zone: NgZone,
    public weekService: WeekService,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    // this.userId = this.authService.getUserId();
    this.authService.getUserById().subscribe(data => {
      this.user = data;
      this.getShiftsType(this.user[0]);
    });
  }

  getShiftsType(user) {
    if (!user) {
      return;
    }
    this.weekService.getAllSidurs().subscribe((data: []) => {
      const allSidur = data;
      var userId = user._id;

      var CountTypeShifts = [];
      CountTypeShifts[0] = 0;
      CountTypeShifts[1] = 0;
      CountTypeShifts[2] = 0;

      // tslint:disable-next-line: forin
      for (var key in allSidur) {
        this.countShiftByUsers(allSidur[key], userId, CountTypeShifts);
        for (var i = 0; i < this.dataGraph.length; i++) {
          this.dataGraph[i].litres = CountTypeShifts[i];
        }
      }
      this.createGraph(this.dataGraph);
      this.createGaraph2(this.dataGraph);
    })
  }


  createGraph(dataGraph) {
    this.zone.runOutsideAngular(() => {

      let chart = am4core.create("chartdiv", am4charts.PieChart3D);
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
      chart.data = dataGraph;

      chart.innerRadius = am4core.percent(40);
      chart.depth = 120;
      chart.legend = new am4charts.Legend();

      let series = chart.series.push(new am4charts.PieSeries3D());
      series.dataFields.value = "litres";
      series.dataFields.depthValue = "litres";
      series.dataFields.category = "country";
      series.slices.template.cornerRadius = 5;
      series.colors.step = 3;

    });
  }

  createGaraph2(data) {
    this.zone.runOutsideAngular(() => {

      let iconPath = "M53.5,476c0,14,6.833,21,20.5,21s20.5-7,20.5-21V287h21v189c0,14,6.834,21,20.5,21 c13.667,0,20.5-7,20.5-21V154h10v116c0,7.334,2.5,12.667,7.5,16s10.167,3.333,15.5,0s8-8.667,8-16V145c0-13.334-4.5-23.667-13.5-31 s-21.5-11-37.5-11h-82c-15.333,0-27.833,3.333-37.5,10s-14.5,17-14.5,31v133c0,6,2.667,10.333,8,13s10.5,2.667,15.5,0s7.5-7,7.5-13 V154h10V476 M61.5,42.5c0,11.667,4.167,21.667,12.5,30S92.333,85,104,85s21.667-4.167,30-12.5S146.5,54,146.5,42 c0-11.335-4.167-21.168-12.5-29.5C125.667,4.167,115.667,0,104,0S82.333,4.167,74,12.5S61.5,30.833,61.5,42.5z"

      let chart = am4core.create("chartdiv2", am4charts.SlicedChart);
      chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect


      // chart.data = data;
      for (var i = 0; i < data.length; i++) {
        console.log(data[i]);
        chart.data[i] = { "name": data[i].country, "value": data[i].litres }
      }


      let series = chart.series.push(new am4charts.PictorialStackedSeries());
      series.dataFields.value = "value";
      series.dataFields.category = "name";
      series.alignLabels = true;

      series.maskSprite.path = iconPath;
      series.ticks.template.locationX = 1;
      series.ticks.template.locationY = 0.5;

      series.labelsContainer.width = 20;

      chart.legend = new am4charts.Legend();
      chart.legend.position = "left";
      chart.legend.valign = "bottom";
    })
  }




  countShiftByUsers(SidurObj, userId, CountTypeShifts) {
    var qubes = SidurObj.qubes;
    for (var i = 0; i < qubes.length; i++) {
      for (var j = 0; j < qubes[i].length; j++) {
        if (userId == qubes[i][j].userId) {
          if (i < 6) {
            CountTypeShifts[0]++;
          } else if (i > 5 && i < 12) {
            CountTypeShifts[1]++;
          } else {
            CountTypeShifts[2]++;
          }
        }
      }
    }
  }
}
