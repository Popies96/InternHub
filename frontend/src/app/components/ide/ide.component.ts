import { Component, ViewChild } from '@angular/core';
import {
  MonacoEditorComponent,
  MonacoEditorConstructionOptions,
  MonacoEditorLoaderService,
  MonacoStandaloneCodeEditor
  } from '@materia-ui/ngx-monaco-editor';


@Component({
  selector: 'app-ide',
  templateUrl: './ide.component.html',
  styleUrls: ['./ide.component.css']
})
export class IdeComponent {
  userLanguage = 'javascript';
  userCode = '// Start coding here...\nvar a = 2;';
  availableLanguages = ['javascript', 'typescript', 'html', 'css', 'python'];

  editorOptions = {
    theme: 'vs-dark',
    language: this.userLanguage,
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    scrollbar: {
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
      useShadows: false
    }
  };

  changeLanguage(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.userLanguage = select.value;
    this.editorOptions = { 
      ...this.editorOptions, 
      language: this.userLanguage 
    };
  }

  editorInit(editor: any) {
    // Fix for initial layout issues
    setTimeout(() => editor.layout(), 50);
  }
}