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
      console.log(allSidur);
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

      this.createGraph(this.dataGraph)
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
