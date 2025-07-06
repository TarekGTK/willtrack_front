import { Component } from '@angular/core';
import { Magasin } from 'src/app/core/model/magasin.model';
import { MagasinService } from 'src/app/core/services/magasin.service';

@Component({
  selector: 'app-magasin',
  standalone: true,
  imports: [],
  templateUrl: './magasin.component.html',
  styleUrl: './magasin.component.scss'
})
export class MagasinComponent {
  magasins: Magasin[] = [];
  nouveauMagasin: Magasin = { id: 0, nom: '', localisation: '' };

  constructor(private magasinService: MagasinService) {}

  ngOnInit(): void {
   // this.magasinService.getAll().subscribe(m => this.magasins = m);
  }

/*  addMagasin() {
    this.magasinService.save(this.nouveauMagasin).subscribe(saved => {
      this.magasins.push(saved);
      this.nouveauMagasin = { id: 0, nom: '', localisation: '' };
    });
  }*/
}
