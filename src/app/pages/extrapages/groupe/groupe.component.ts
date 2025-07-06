import { Component } from '@angular/core';
import { Groupe } from 'src/app/core/model/groupe.model';
import { GroupeService } from 'src/app/core/services/groupe.service';

@Component({
  selector: 'app-groupe',
  standalone: true,
  imports: [],
  templateUrl: './groupe.component.html',
  styleUrl: './groupe.component.scss'
})
export class GroupeComponent {
  groupes: Groupe[] = [];
  nouveauGroupe: Groupe = { id: 0, nom: '' };

  constructor(private groupeService: GroupeService) {}

  ngOnInit(): void {
    this.groupeService.getAll().subscribe(g => this.groupes = g);
  }

  addGroupe() {
    this.groupeService.save(this.nouveauGroupe).subscribe(saved => {
      this.groupes.push(saved);
      this.nouveauGroupe = { id: 0, nom: '' };
    });
  }
}
