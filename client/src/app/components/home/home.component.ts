import {
  Component, OnInit,
  NgZone
} from '@angular/core';
import * as moment from 'moment';

import { AuthService } from 'src/app/services/auth.service';
import { WeekService } from 'src/app/services/week.service';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private chart: am4charts.XYChart;

  allUsers;
  dataGraph = [];
  constructor(
    private zone: NgZone,
    public weekService: WeekService,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
  }
  getAllUsers() {
    this.authService.getAllUsers().subscribe(data => {
      this.allUsers = data;
      this.getShiftsType();
    })
  }
  getShiftsType() {
    this.weekService.getAllSidurs().subscribe((data: []) => {
      const allSidur = data;
      console.log(allSidur);
      for (var i = 0; i < this.allUsers.length; i++) {
        var userId = this.allUsers[i]._id;
        this.dataGraph[i] = { name: this.allUsers[i].name, A: 0, B: 0, C: 0, D: 0, E: 0 };
        var CountTypeShifts = [];
        CountTypeShifts[0] = 0;
        CountTypeShifts[1] = 0;
        CountTypeShifts[2] = 0;
        CountTypeShifts[3] = 0;
        CountTypeShifts[4] = 0;



        for (var key in allSidur) {
          this.countShiftByUsers(allSidur[key], userId, CountTypeShifts);
          this.dataGraph[i].A = CountTypeShifts[0];
          this.dataGraph[i].B = CountTypeShifts[1];
          this.dataGraph[i].C = CountTypeShifts[2];
          this.dataGraph[i].D = CountTypeShifts[3];
          this.dataGraph[i].E = CountTypeShifts[4];
        }
      }
      //creategraph
      this.dataGraph.reverse();
      this.createGraph(this.dataGraph);

    })
  }

  countShiftByUsers(SidurObj, userId, CountTypeShifts) {
    var qubes = SidurObj.qubes;
    for (var i = 0; i < qubes.length; i++) {
      for (var j = 0; j < qubes[i].length; j++) {
        if (userId == qubes[i][j].userId) {
          if (i < 6) {
            if (i == 5) {
              CountTypeShifts[3]++;
            } else {
              CountTypeShifts[0]++;
            }
          } else if (i > 5 && i < 12) {
            CountTypeShifts[1]++;
          } else if (i == 17) {
            CountTypeShifts[4]++;
          } else {
            CountTypeShifts[2]++;
          }
        }
      }
    }
  }

  createGraph(dataGraph) {
    this.zone.runOutsideAngular(() => {

      let chart = am4core.create("chartdiv", am4charts.XYChart);
      chart.data = dataGraph;

      chart.legend = new am4charts.Legend();
      chart.legend.position = "right";

      // Create axes
      let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "name";
      categoryAxis.renderer.grid.template.opacity = 0;

      let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      valueAxis.renderer.grid.template.opacity = 0;
      valueAxis.renderer.ticks.template.strokeOpacity = 0.5;
      valueAxis.renderer.ticks.template.stroke = am4core.color("#495C43");
      valueAxis.renderer.ticks.template.length = 10;
      valueAxis.renderer.line.strokeOpacity = 0.5;
      valueAxis.renderer.baseGrid.disabled = true;
      valueAxis.renderer.minGridDistance = 40;

      // Create series
      function createSeries(field, name) {
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueX = field;
        series.dataFields.categoryY = "name";
        series.stacked = true;
        series.name = name;

        let labelBullet = series.bullets.push(new am4charts.LabelBullet());
        labelBullet.locationX = 0.5;
        labelBullet.label.text = "{valueX}";
        labelBullet.label.fill = am4core.color("#fff");
      }
      createSeries("A", "משמרת א");
      createSeries("B", "משמרת ב");
      createSeries("C", "משמרת ג");
      createSeries("D", "משמרת ו");
      createSeries("E", "משמרת ש");

    });
  }


  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}
