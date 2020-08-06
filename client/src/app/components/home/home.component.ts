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

  constructor(
    private zone: NgZone,
    public weekService: WeekService,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.getShiftsType();
  }
  getShiftsType() {
    this.weekService.getAllSidurs().subscribe((data: []) => {
      const allSidur = data;
      for (var i = 0; i < allSidur.length; i++) {
        console.log(allSidur[i]);
      }
    })
  }

}
