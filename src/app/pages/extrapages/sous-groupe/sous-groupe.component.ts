import { Component } from '@angular/core';
import { Groupe } from 'src/app/core/model/groupe.model';
import { SousGroupe } from 'src/app/core/model/sousGroupe.model';
import { GroupeService } from 'src/app/core/services/groupe.service';
import { SousGroupeService } from 'src/app/core/services/sous-groupe.service';

@Component({
  selector: 'app-sous-groupe',
  standalone: true,
  imports: [],
  templateUrl: './sous-groupe.component.html',
  styleUrl: './sous-groupe.component.scss'
})
export class SousGroupeComponent {
  sousGroupes: SousGroupe[] = [];
  nouveauSousGroupe: SousGroupe = { id: 0, nom: '', groupe: { id: 0, nom: '' } };
  groupes: Groupe[] = [];

  constructor(private sousGroupeService: SousGroupeService, private groupeService: GroupeService) {}

  ngOnInit(): void {
    this.sousGroupeService.getAll().subscribe(sg => this.sousGroupes = sg);
    this.groupeService.getAll().subscribe(g => this.groupes = g);
  }

  addSousGroupe() {
    this.sousGroupeService.save(this.nouveauSousGroupe).subscribe(saved => {
      this.sousGroupes.push(saved);
      this.nouveauSousGroupe = { id: 0, nom: '', groupe: { id: 0, nom: '' } };
    });
  }
}
