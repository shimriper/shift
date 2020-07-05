import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder } from '@angular/forms';
import { WeekService } from 'src/app/services/week.service';
import * as moment from 'moment';

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
    this.getAllUsers();

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
    });
  }

  getAllUsers() {
    this.authService.getAllUsers().subscribe(data => {
      this.users = data;
      for (var i = 0; i < this.users.length; i++) {
        for (var j = 0; this.editSidur.length; j++) {
          var obj = {
            userId: this.users[i]._id,
            name: this.users[i].name,
            isExist: false
          }
          this.editSidur[j].push(obj);
        }
      }
      console.log(this.editSidur)

    })
  }
}

