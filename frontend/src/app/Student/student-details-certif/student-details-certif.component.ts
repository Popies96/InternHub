import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Certificate } from 'src/app/models/Certificat';
import { CertificateService } from 'src/app/services/certificate.service';

@Component({
  selector: 'app-student-details-certif',
  templateUrl: './student-details-certif.component.html',
  styleUrls: ['./student-details-certif.component.css']
})
export class StudentDetailsCertifComponent implements OnInit {
  certificate: Certificate | undefined;
  isLoading = true;
  verificationUrl = '';

  constructor(
    private route: ActivatedRoute,
    private certificateService: CertificateService,
    private router: Router
  ) {}


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCertificate(+id);
    }
  }

  loadCertificate(id: number): void {
    this.certificateService.getCertificateById(id).subscribe({
      next: (data) => {
        this.certificate = data;
        // Générer l'URL de vérification pour le QR Code
        this.verificationUrl = `${window.location.origin}/verify/${data.verificationID}`;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading certificate', err);
        this.isLoading = false;
      }
    });
  }
  

  navigateToList(): void {
    this.router.navigate(['student/certifStudent']);
  }

  printCertificate(): void {
  
    const printContent = document.querySelector('.certificate-page-container .mx-auto')?.cloneNode(true) as HTMLElement;
    
    if (printContent) {
     
      const printWindow = window.open('', '', 'width=800,height=600');
      
      if (printWindow) {
        
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Certificate</title>
            <style>
              @import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.0/font/bootstrap-icons.css');
              body { 
                margin: 0; 
                padding: 0; 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                background-color: white !important;
              }
              .print-container {
                width: 100%;
                height: 100%;
                padding: 20px;
              }
              /* Copier les styles pertinents de votre certificat */
              .text-indigo-800 { color: #3730a3; }
              .text-indigo-400 { color: #818cf8; }
              .text-indigo-500 { color: #6366f1; }
              .text-indigo-600 { color: #4f46e5; }
              .text-indigo-700 { color: #4338ca; }
              .text-gray-900 { color: #111827; }
              .text-gray-600 { color: #4b5563; }
              .text-gray-500 { color: #6b7280; }
              .bg-indigo-50 { background-color: #eef2ff; }
              .border-indigo-100 { border-color: #e0e7ff; }
              .max-w-3xl { max-width: 48rem; }
              .rounded-xl { border-radius: 0.75rem; }
              .shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); }
              .p-8 { padding: 2rem; }
              .mb-8 { margin-bottom: 2rem; }
              .text-center { text-align: center; }
              .font-bold { font-weight: 700; }
              .tracking-tight { letter-spacing: -0.025em; }
              .uppercase { text-transform: uppercase; }
              .text-xs { font-size: 0.75rem; line-height: 1rem; }
              .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
              .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
              .text-2xl { font-size: 1.5rem; line-height: 2rem; }
              .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
              .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
              .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
              .from-indigo-600 { --tw-gradient-from: #4f46e5; --tw-gradient-to: rgb(79 70 229 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
              .to-purple-600 { --tw-gradient-to: #9333ea; }
              .bg-clip-text { -webkit-background-clip: text; background-clip: text; }
              .text-transparent { color: transparent; }
              .font-semibold { font-weight: 600; }
              .mx-auto { margin-left: auto; margin-right: auto; }
              .max-w-2xl { max-width: 42rem; }
              .inline-flex { display: inline-flex; }
              .items-center { align-items: center; }
              .h-5 { height: 1.25rem; }
              .w-5 { width: 1.25rem; }
              .mr-1 { margin-right: 0.25rem; }
              .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
              .flex { display: flex; }
              .justify-between { justify-content: space-between; }
              .mt-12 { margin-top: 3rem; }
              .pt-6 { padding-top: 1.5rem; }
              .border-t { border-top-width: 1px; }
              .w-1/2 { width: 50%; }
              .px-4 { padding-left: 1rem; padding-right: 1rem; }
              .h-0.5 { height: 0.125rem; }
              .w-full { width: 100%; }
              .mb-3 { margin-bottom: 0.75rem; }
              .font-medium { font-weight: 500; }
              .text-indigo-300 { color: #a5b4fc; }
              .absolute { position: absolute; }
              .top-4 { top: 1rem; }
              .right-4 { right: 1rem; }
              .w-14 { width: 3.5rem; }
              .h-14 { height: 3.5rem; }
              .rounded-full { border-radius: 9999px; }
              .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
              .from-indigo-500 { --tw-gradient-from: #6366f1; --tw-gradient-to: rgb(99 102 241 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
              .to-indigo-700 { --tw-gradient-to: #4338ca; }
              .justify-center { justify-content: center; }
              .text-white { color: #ffffff; }
              .shadow-md { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
              .border-2 { border-width: 2px; }
              .border-white { border-color: #ffffff; }
              .h-6 { height: 1.5rem; }
              .w-6 { width: 1.5rem; }
              .relative { position: relative; }
              .z-10 { z-index: 10; }
              .md\:p-12 { padding: 3rem; }
            </style>
            <style media="print">
              @page { size: A4; margin: 0; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            </style>
          </head>
          <body>
            <div class="print-container">
              ${printContent.outerHTML}
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 200);
              }
            </script>
          </body>
          </html>
        `);
        
        printWindow.document.close();
      }
    }
  }
  
  
  
  }