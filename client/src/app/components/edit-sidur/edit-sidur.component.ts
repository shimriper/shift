import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder } from '@angular/forms';
import { WeekService } from 'src/app/services/week.service';
import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-edit-sidur',
  templateUrl: './edit-sidur.component.html',
  styleUrls: ['./edit-sidur.component.css']
})
export class EditSidurComponent implements OnInit {
  sidurData;
  saturday;
  sunday;
  users;
  editSidur = Array(18).fill(null);
  sidur = [];

  constructor(
    public fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private weekService: WeekService
  ) { }


  public weekArray = ['א', 'ב', 'ג', 'ד', 'ה', 'ו'];

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

  ngOnInit(): void {
    let id = this.actRoute.snapshot.paramMap.get('id');
    this.getSidurById(id)
    // this.getAllUsers();

  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  getSidurById(id) {
    this.weekService.getSidurById(id).subscribe(data => {
      console.log(data);
      this.sidurData = data.qubes;
      this.getAllUsers();


    });
  }

  getAllUsers() {
    this.authService.getAllUsers().subscribe(data => {
      this.users = data;
      var sqursUsers = [];

      for (var i = 0; i < this.users.length; i++) {
        sqursUsers.push({
          userId: this.users[i]._id,
          name: this.users[i].name,
          isExist: false
        })
      }

      for (var i = 0; i < sqursUsers.length; i++) {
        var userTmpId = sqursUsers[i];
        for (var j = 0; j < this.sidurData.length; j++) {
          var flag = false;
          if (j != 11) {
            for (var k = 0; k < this.sidurData[j].length; k++) {
              if (userTmpId.userId === this.sidurData[j][k].userId) {
                flag = true;
                this.sidurData[j][k].isExist = true;
              }
            }
          }
          if (!flag) {
            this.sidurData[j].push({ userId: userTmpId.userId, name: userTmpId.name, isExist: false });
          }
        }
      }
    })
  }

  saveSidur() {
    let id = this.actRoute.snapshot.paramMap.get('id');

    for (var i = 0; i < this.sidurData.length; i++) {
      var sidurQube = [];
      for (var j = 0; j < this.sidurData[i].length; j++) {
        if (this.sidurData[i][j].isExist) {
          sidurQube.push(this.sidurData[i][j]);
        }
      }
      this.sidur[i] = sidurQube;
    }
    let sidurEnd = {
      qubes: this.sidur
    }

    this.weekService.updateSidur(id, sidurEnd).subscribe(data => {
      this.router.navigate(['/sidur-list']);
    })
  }


  changeSidor(i, j, user, name) {
    if (i < 6) {
      if (user.isExist) {
        this.sidurData[i][j].isExist = false;
      } else {
        this.sidurData[i + 6].forEach((item, index) => {
          if (user.userId == item.userId) {
            if (item.isExist) {
              this.areYouSure(item, i, j)
            } else {
              this.sidurData[i][j].isExist = true;
            }
          }
        });
        if (i != 0) {
          this.sidurData[i + 11].forEach((item, index) => {
            if (user.userId == item.userId) {
              if (item.isExist) {
                this.areYouSure(item, i, j)
              } else {
                this.sidurData[i][j].isExist = true;
              }
            }
          });
        }
      }
    }
    else if (i > 5 && i < 12) {
      if (user.isExist) {
        this.sidurData[i][j].isExist = false;
      } else {
        if (i != 11) {
          this.sidurData[i + 6].forEach((item, index) => {
            if (user.userId == item.userId) {
              if (item.isExist) {
                this.areYouSure(item, i, j)
              } else {
                this.sidurData[i][j].isExist = true;
              }
            }
          });
          this.sidurData[i - 6].forEach((item, index) => {
            if (user.userId == item.userId) {
              if (item.isExist) {
                this.areYouSure(item, i, j)
              } else {
                this.sidurData[i][j].isExist = true;
              }
            }
          });
        }
      }

    }
    else if (i > 11 && i < 18) {
      if (user.isExist) {
        this.sidurData[i][j].isExist = false;
      } else {
        if (i != 17) {
          this.sidurData[i - 6].forEach((item, index) => {
            if (user.userId == item.userId) {
              if (item.isExist) {
                this.areYouSure(item, i, j)
              } else {
                this.sidurData[i][j].isExist = true;
              }
            }
          });
          this.sidurData[i - 11].forEach((item, index) => {
            if (user.userId == item.userId) {
              if (item.isExist) {
                this.areYouSure(item, i, j)
              } else {
                this.sidurData[i][j].isExist = true;
              }
            }
          });
        } else {
          this.sidurData[i][j].isExist = true;

        }
      }
    }
  }

  areYouSure(item, i, j) {
    Swal.fire({
      title: 'The employee exist in shift b / c ',
      text: 'Do you want to update ? ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'updated!',
          'Your imaginary file has been updated.',
          'success'
        )
        item.isExist = false;
        this.sidurData[i][j].isExist = true;
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



