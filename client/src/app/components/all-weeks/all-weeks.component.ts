import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { WeekService } from 'src/app/services/week.service';
import { ConstantPool } from '@angular/compiler';

@Component({
  selector: 'app-all-weeks',
  templateUrl: './all-weeks.component.html',
  styleUrls: ['./all-weeks.component.css']
})
export class AllWeeksComponent implements OnInit {
  active = 'top';
  allRemarksByUsers = [];
  users = [];
  allUsers;
  sidur = [];
  form: FormGroup;
  sunday;
  saturday;
  lastSidur;
  public theCheckbox = false;

  constructor(
    public weekService: WeekService,
    public authService: AuthService,
    private formBuilder: FormBuilder,
    public router: Router
  ) {
    this.form = this.formBuilder.group({
      orders: []
    });
  }
  public weekArray = ['א', 'ב', 'ג', 'ד', 'ה', 'ו'];

  squares: any[];
  squares2: any[];

  ngOnInit(): void {
    this.getAllUsers();

    this.squares = Array(18).fill(null);
    this.users = Array(18).fill(null);
    this.fillWeek(this.squares);
    this.getAllReqWeeks();
    this.getLastSat();
    this.getWeek(1);
  }

  getLastSaterday() {
    this.weekService.getLastInsert().subscribe(data => {
      this.lastSidur = data[0].qubes;
      var lastItem = this.lastSidur.pop();
      this.lastSidur = lastItem;

      for (var i = 0; i < this.squares[0].users.length; i++) {
        for (var j = 0; j < this.lastSidur.length; j++) {
          if (this.squares[0].users[i].userId === this.lastSidur[j].userId) {
            // this.squares[0].users.splice(i, 1);
            this.squares[0].users[i].isSaterday = true;
          }
        }
      }

    });
  }

  fillWeek(squares) {
    for (let i = 0; i < squares.length; i++) {
      if (i < 6) {
        squares[i] = { qube: i, day: i + 1, typeShift: 1, users: [] };
      }
      else if (i > 5 && i < 12) {
        squares[i] = { qube: i, day: i - 5, typeShift: 2, users: [] };
      } else {
        squares[i] = { qube: i, day: i - 11, typeShift: 3, users: [] };
      }
    }
  }

  getAllUsers() {
    this.authService.getAllUsers().subscribe((data) => {
      const users = data;
      this.allUsers = data;
      for (var i = 0; i < this.users.length; i++) {
        this.users[i] = users;
      }
    });
  }
  getAllReqWeeks() {
    var days = this.getWeek(1);
    this.weekService.getWeeks(days.sunday, days.saturday).subscribe((data) => {
      const allWeeks = data;
      // tslint:disable-next-line: forin
      for (var key in allWeeks) {
        this.allRemarksByUsers.push({ name: allWeeks[key].creator.name, remark: allWeeks[key].remarks, lastModified: allWeeks[key].lastModified });
        for (var i = 0; i < this.squares.length; i++) {
          if (allWeeks[key].shifts.length < 1) {
            if (i == 11) {
              this.squares[i].users = null;
            } else {
              this.squares[i].users.push({ userId: allWeeks[key].creator._id, name: allWeeks[key].creator.name, isAvilable: true, isCheck: null, lastModified: allWeeks[key].lastModified });
            }
          } else {
            if (i == 11) {
              this.squares[i].users = null;
            } else {
              this.squares[i].users.push({ userId: allWeeks[key].creator._id, name: allWeeks[key].creator.name, isAvilable: true, isCheck: null, lastModified: allWeeks[key].lastModified });
            }
            for (var j = 0; j < allWeeks[key].shifts.length; j++) {
              if (allWeeks[key].shifts[j].qube == this.squares[i].qube) {
                for (var k = 0; k < this.squares[i].users.length; k++) {
                  if (allWeeks[key].shifts[j].creator == this.squares[i].users[k].userId) {
                    this.squares[i].users[k].isAvilable = false;
                  }
                }
              }
            }
          }
        }
      }
      // fix all user that not send request
      this.fixAllUserToReq(this.allUsers);
    });
  }
  fixAllUserToReq(users) {
    if (users.length == 0) {
    } else {
      for (var i = 0; i < this.squares.length; i++) {
        if (i != 11) {
          for (var k = 0; k < users.length; k++) {
            var flag = false;
            var userTemp = users[k];
            for (var j = 0; j < this.squares[i].users.length; j++) {
              if (users[k]._id == this.squares[i].users[j].userId) {
                flag = true;
              }
            }
            if (!flag) {
              this.squares[i].users.push({ userId: userTemp._id, name: userTemp.name, isAvilable: true, isCheck: null });
            }
          }

        }
      }
    }
    this.getLastSaterday();
  }

  changeSidor(i, row, name) {

    if (row.typeShift == 1) {
      //sunday shift boker
      if (row.qube == 0) {
        if (name.isCheck == null) {
          this.squares[row.qube].users[i].isCheck = true;
          this.squares[row.qube + 6].users[i].isCheck = false;
        } else if (name.isCheck == true) {
          this.squares[row.qube].users[i].isCheck = null;
          this.squares[row.qube + 6].users[i].isCheck = null;
        }
      }
      //friday shift boker
      else if (row.qube == 5) {
        if (name.isCheck == null) {
          this.squares[row.qube].users[i].isCheck = true;
          this.squares[row.qube + 11].users[i].isCheck = false;
        } else if (name.isCheck == true) {
          this.squares[row.qube].users[i].isCheck = null;
          this.squares[row.qube + 11].users[i].isCheck = null;
        }
      } else {
        if (name.isCheck == null) {
          this.squares[row.qube].users[i].isCheck = true;
          this.squares[row.qube + 11].users[i].isCheck = false;
          this.squares[row.qube + 6].users[i].isCheck = false;
        } else if (name.isCheck == true) {
          this.squares[row.qube].users[i].isCheck = null;
          this.squares[row.qube + 11].users[i].isCheck = null;
          this.squares[row.qube + 6].users[i].isCheck = null;
        }
      }
    }
    else if (row.typeShift == 2) {
      if (name.isCheck == null) {
        this.squares[row.qube].users[i].isCheck = true;
        this.squares[row.qube - 6].users[i].isCheck = false;
        this.squares[row.qube + 6].users[i].isCheck = false;
      } else if (name.isCheck == true) {
        this.squares[row.qube].users[i].isCheck = null;
        this.squares[row.qube - 6].users[i].isCheck = null;
        this.squares[row.qube + 6].users[i].isCheck = null;
      }
    }
    else if (row.typeShift == 3) {
      if (row.qube == 17) {
        if (name.isCheck == null) {
          this.squares[row.qube].users[i].isCheck = true;
        }
        else if (name.isCheck == true) {
          this.squares[row.qube].users[i].isCheck = null;
        }
      } else {
        if (name.isCheck == null) {
          this.squares[row.qube].users[i].isCheck = true;
          this.squares[row.qube - 11].users[i].isCheck = false;
          this.squares[row.qube - 6].users[i].isCheck = false;
        } else if (name.isCheck == true) {
          this.squares[row.qube].users[i].isCheck = null;
          this.squares[row.qube - 11].users[i].isCheck = null;
          this.squares[row.qube - 6].users[i].isCheck = null;
        }
      }
    }
  }
  myChoose(i, row, name) {
    if (row.typeShift == 1) {
      if (row.qube > 0) {
        this.squares[row.qube + 11].users.forEach((item, index) => {
          if (item === name) {
            this.squares[row.qube + 11].users.splice(index, 1);
          }
        });
      }
      this.squares[row.qube + 6].users.forEach((item, index) => {
        if (item === name) {
          this.squares[row.qube + 6].users.splice(index, 1);
        }
      });
    } else if (row.typeShift == 2) {
      this.squares[row.qube - 6].users.forEach((item, index) => {
        if (item === name) {
          this.squares[row.qube - 6].users.splice(index, 1);
        }
      });
      this.squares[row.qube + 6].users.forEach((item, index) => {
        if (item === name) {
          this.squares[row.qube + 6].users.splice(index, 1);
        }
      });
    }
    else if (row.typeShift == 3) {
      // if (row.typeShift < 19) {
      //   this.squares[row.qube - 13].users.forEach((item, index) => {
      //     if (item === name) {
      //       this.squares[row.qube - 13].users.splice(index, 1);
      //     }
      //   });
      // }
      this.squares[row.qube - 6].users.forEach((item, index) => {
        if (item === name) {
          this.squares[row.qube - 6].users.splice(index, 1);
        }
      });
    }
  }

  saveSidur() {
    for (var i = 0; i < this.squares.length; i++) {
      var sidurQube = [];
      if (this.squares[i].users != null) {
        for (var j = 0; j < this.squares[i].users.length; j++) {
          if (this.squares[i].users[j].isCheck === true) {
            let userObj = {
              userId: this.squares[i].users[j].userId,
              name: this.squares[i].users[j].name,
              priority: this.squares[i].users[j].priority
            }
            sidurQube.push(userObj);
          }
        }
      }

      this.sidur[i] = sidurQube;
    }
    var days = this.getWeek(1);
    let sidurEnd = {
      start: days.sunday,
      end: days.saturday,
      qubes: this.sidur
    }

    this.weekService.createSidur(sidurEnd).subscribe(data => {
      this.opensweetalert();
      this.router.navigate(['/sidur-list']);
    })
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

  getLastSat() {
    var Sat = moment().add(-1, 'week').endOf('week');
    var San = moment().add(-1, 'week').startOf('week');

    this.weekService.getLastSidur(San, Sat).subscribe((res: []) => {
      if (res.length > 0) {
      }
    })
  }

  opensweetalert() {
    Swal.fire({
      text: 'Request of Shift added!',
      icon: 'success'
    });
  }

}
