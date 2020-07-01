import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { Week } from '../../models/week.model';
import { Shift } from '../../models/shift.model';

import { FormBuilder, FormGroup, NgForm } from '@angular/forms';


import { AuthService } from 'src/app/services/auth.service';
import { ShiftService } from 'src/app/services/shift.service';
import { WeekService } from 'src/app/services/week.service';

@Component({
  selector: 'app-week-create',
  templateUrl: './week-create.component.html',
  styleUrls: ['./week-create.component.css']
})
export class WeekCreateComponent implements OnInit {
  remarksForm: FormGroup;

  week;
  shiftLast;
  changeShift: Shift[] = [];
  shifts: Shift[] = [];
  chooseOption = [1, 2];

  shiftsId;
  isUpdate = false;
  sunday;
  saturday;
  deleteState = false;
  // currentUser:User;
  squares: any[];
  squares2: any[];

  numOfWeek = 1;

  userId: string;

  public weekArray = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
  constructor(public authService: AuthService,
    public shiftService: ShiftService,
    public weekService: WeekService,
    public fb: FormBuilder,

  ) {
    this.remarksForm = this.fb.group({
      remarks: [''],
    });
  }
  changeOption(e) {
    this.numOfWeek = e.target.value;

  }

  createWeek() {
    if (this.numOfWeek == 2) {
      this.squares2 = Array(21).fill(null);
      this.fillWeek(this.squares2);
    }
    this.squares = Array(21).fill(null);
    this.fillWeek(this.squares);
  }


  canceleShift(shift, i, week) {
    if (this.isUpdate) {
      this.shifts = this.shiftLast;
    }
    if (shift.isAvilable) {
      week[i].isAvilable = false;
      this.shifts.push(week[i]);
    } else {
      week[i].isAvilable = true;
      this.shifts.forEach((item, index) => {
        if (item.qube === week[i].qube) {
          this.shifts.splice(index, 1);
        }
      });
    }
  }

  getMyWeek() {
    this.weekService.getWeekByCreator().subscribe((data: { message, data }) => {
      if (data.message) {
        this.isUpdate = false;
      } else {
        this.remarksForm.setValue({
          remarks: data['remarks']
        })
        this.shiftsId = data;
        this.isUpdate = true;
        var startDay = this.getWeek(1);
        this.shiftService.getMyShiftsByDate(startDay.sunday, startDay.saturday)
          .subscribe(res => {
            this.shiftLast = res;
            this.fillArrByLastReq(this.shiftLast);
          })
      }
    })
  }

  sendRequests() {
    this.shiftService.addShift(this.shifts)
      .subscribe(res => {
        let shiftsIds = res;
        var remark = this.remarksForm.value;

        var days = this.getWeek(1);
        this.week = {
          start: new Date(days.sunday),
          end: new Date(days.saturday),
          creator: this.userId,
          shifts: shiftsIds,
          remarks: remark.remarks
        };
        console.log(this.week);
        this.weekService.addWeek(this.week).subscribe(res => {
          let weekId = res;
          this.isUpdate = true;
          if (this.deleteState == false) {
            this.opensweetalert();
          }
        });
      });
  }


  fillWeek(week) {
    for (let i = 0; i < week.length; i++) {
      var date;
      if (i < 7) {
        date = this.getDayDate(i);
        week[i] = { qube: i, day: i + 1, typeShift: 1, isAvilable: true, dateShift: date };
      }
      else if (i > 6 && i < 14) {
        date = this.getDayDate(i - 7);
        week[i] = { qube: i, day: i - 6, typeShift: 2, isAvilable: true, dateShift: date };
      } else {
        date = this.getDayDate(i - 14);
        week[i] = { qube: i, day: i - 13, typeShift: 3, isAvilable: true, dateShift: date };
      }
    }
  }
  getWeek(next: number) {
    var sunday = moment().add(next, 'week').startOf('week').format();
    var saturday = moment().add(next, 'week').endOf('week').format();

    this.sunday = moment(sunday).format('DD.MM');
    this.saturday = moment(saturday).format('DD.MM');

    return {
      sunday: sunday,
      saturday: saturday
    }
  }

  getDayDate(date: number) {
    var sunday = moment().add(1, 'week').day(date);
    return sunday;
  }
  ngOnInit(): void {
    this.getMyWeek();
    this.createWeek();
    // this.getWeek(1);
    // this.getMyShiftsReq(1);
  }

  fillArrByLastReq(shiftLast) {
    for (var i = 0; i < shiftLast.length; i++) {
      this.squares[shiftLast[i].qube].isAvilable = false;
    }
  }

  updateReq() {
    this.shifts = this.shiftLast;
    this.opensweetalertcst();
  }



  // sweet alert
  opensweetalert() {
    Swal.fire({
      text: 'Request of Shift added!',
      icon: 'success'
    });
  }
  opensweetalertdng() {
    Swal.fire('Oops...', 'Something went wrong!', 'error')
  }

  opensweetalertcst() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this imaginary file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      this.shiftService.deleteAllReq().
        subscribe(res => {
          this.weekService.deleteWeek().subscribe(data => {
            this.sendRequests();
            this.deleteState = true;
          })
        });
      if (result.value) {
        Swal.fire(
          'Deleted!',
          'Your imaginary file has been deleted.',
          'success'
        )
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })
  }
}
