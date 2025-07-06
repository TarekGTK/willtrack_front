import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupeService } from 'src/app/core/services/groupe.service';
import { MagasinService } from 'src/app/core/services/magasin.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.scss']
})
export class PieceComponent implements OnInit {
  @ViewChild('showModal', { static: false }) showModal?: ModalDirective;
  
  magasinPieces: any[] = [];
  allMagasinPieces: any[] = [];
  groupes: any[] = [];
  sousGroupes: any[] = [];
  filteredSousGroupes: any[] = [];
  magasins: any[] = [];
  emplacements: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  selectedEmplacements: string[] = [];
 
  
  // Filtres
  selectedGroupe: any = null;
  
  searchText: string = '';
  
  // Tri
  sortField: string = 'piece.nom';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Formulaire
  pieceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private magasinService: MagasinService,
    private groupeService: GroupeService,private toastr:ToastrService
  ) {
    this.pieceForm = this.fb.group({
      nom: ['', Validators.required],
      reference: ['', Validators.required],
      consommationJournaliere: ['', [Validators.required, Validators.min(0.01)]],
      delaiSecurite: ['', [Validators.required, Validators.min(1)]],
      groupe: ['', Validators.required],
      sousGroupe: ['', Validators.required],
      emplacement: [[], Validators.required],
      quantite: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadMagasinPieces();
    this.loadGroupes();
    this.loadSousGroupes();
    this.loadMagasins();
    this.initEmplacements();
  }

  loadMagasinPieces(): void {
    this.magasinService.getPieces().subscribe(data => {
      this.allMagasinPieces = data;
      this.applyFilters();
    });
  }

  loadGroupes(): void {
    this.magasinService.getGroupes().subscribe(data => {
      this.groupes = data;
    });
  }

  loadSousGroupes(): void {
    this.magasinService.getSousGroupes().subscribe(data => {
      this.sousGroupes = data;
    });
  }

  loadMagasins(): void {
    this.magasinService.getMagasins().subscribe(data => {
      this.magasins = data;
    });
  }

  initEmplacements(): void {
    
    this.emplacements = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  }

  toggleEmplacement(emp: string): void {
    const index = this.selectedEmplacements.indexOf(emp);
    if (index === -1) {
      this.selectedEmplacements.push(emp);
    } else {
      this.selectedEmplacements.splice(index, 1);
    }
    this.pieceForm.get('emplacement')?.setValue(this.selectedEmplacements);
  }

  onGroupeChange(): void {
    const groupeId = this.pieceForm.get('groupe')?.value;
    this.filteredSousGroupes = this.sousGroupes.filter(sg => sg.groupe?.id == groupeId);
    this.pieceForm.get('sousGroupe')?.reset();
  }

 

  applyFilters(): void {
    let filtered = [...this.allMagasinPieces];

    // Filtre par groupe
    if (this.selectedGroupe) {
      filtered = filtered.filter(mp => 
        mp.piece?.sousGroupe?.groupe?.id === this.selectedGroupe.id
      );
    }



    // Filtre de recherche
    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(mp => 
        mp.piece?.nom?.toLowerCase().includes(searchLower) ||
        mp.piece?.reference?.toLowerCase().includes(searchLower) ||
        mp.magasin?.nom?.toLowerCase().includes(searchLower) ||
        mp.piece?.sousGroupe?.nom?.toLowerCase().includes(searchLower) ||
        mp.piece?.sousGroupe?.groupe?.nom?.toLowerCase().includes(searchLower) ||
        mp.emplacement?.nom?.toLowerCase().includes(searchLower)
      );
    }

    // Tri
    filtered.sort((a, b) => {
      const fieldA = this.getNestedProperty(a, this.sortField);
      const fieldB = this.getNestedProperty(b, this.sortField);
      
      if (fieldA < fieldB) return this.sortDirection === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.magasinPieces = filtered;
  }

  getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o?.[p], obj);
  }

  sort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  resetFilters(): void {
    this.selectedGroupe = null;
    this.searchText = '';
    this.sortField = 'piece.nom';
    this.sortDirection = 'asc';
    this.applyFilters();
  }
  private calculateSafetyStock(consommation: number, delai: number): number {
    return Math.round(consommation * delai);
  }

  addPiece(): void {
    if (this.pieceForm.valid) {
      // Calculate safety stock
      const seuilMin = this.calculateSafetyStock(
        this.pieceForm.get('consommationJournaliere')?.value,
        this.pieceForm.get('delaiSecurite')?.value
      );
  
      // Prepare piece data
      const pieceData = {
        nom: this.pieceForm.get('nom')?.value,
        reference: this.pieceForm.get('reference')?.value,
        consommationJournaliere: this.pieceForm.get('consommationJournaliere')?.value,
        delaiSecurite: this.pieceForm.get('delaiSecurite')?.value,
        seuilMin: seuilMin,
        sousGroupe: { id: this.pieceForm.get('sousGroupe')?.value }
      };
  
      // Prepare magasinPiece data
      const magasinPieceData = {
        piece: pieceData,
        quantite: this.pieceForm.get('quantite')?.value,
        emplacement: this.pieceForm.get('emplacement')?.value.join(',') // Convert array to string
      };
  
      console.log('Data being sent:', magasinPieceData);
      
      this.magasinService.addPiece(magasinPieceData).subscribe({
        next: (response) => {
          this.showModal?.hide();
          this.loadMagasinPieces();
          this.pieceForm.reset();
          this.selectedEmplacements = [];
        },
        error: (err) => {
          console.error('Error adding piece:', err);
        }
      });
    }
  }

  updateQuantite(mp: any) {
    if (mp.quantite < 0) {
      alert("La quantité ne peut pas être négative !");
      return;
    }
  
    this.magasinService.updateQuantite(mp.id, mp.quantite).subscribe({
      next: () => {
        this.toastr.success("Quantité mise à jour avec succès");
      },
      error: () => {
        this.toastr.error("Erreur lors de la mise à jour");
      }
    });
  }
}