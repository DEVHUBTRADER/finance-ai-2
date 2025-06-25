import React, { useState } from 'react';
import { Plus, FolderOpen, FileText, Upload, Search, Edit, Trash2, Download, Eye } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  folder: string;
  url?: string;
}

interface Folder {
  id: string;
  name: string;
  color: string;
  documentCount: number;
}

const mockFolders: Folder[] = [
  { id: '1', name: 'Imposto de Renda', color: 'bg-blue-500', documentCount: 5 },
  { id: '2', name: 'Documentos Pessoais', color: 'bg-green-500', documentCount: 8 },
  { id: '3', name: 'Trabalho', color: 'bg-purple-500', documentCount: 12 },
  { id: '4', name: 'Contratos', color: 'bg-orange-500', documentCount: 3 },
];

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Declaração IR 2023.pdf',
    type: 'PDF',
    size: '2.5 MB',
    uploadDate: '2024-01-15',
    folder: 'Imposto de Renda'
  },
  {
    id: '2',
    name: 'Comprovante Residência.pdf',
    type: 'PDF',
    size: '1.2 MB',
    uploadDate: '2024-01-10',
    folder: 'Documentos Pessoais'
  },
  {
    id: '3',
    name: 'Contrato Trabalho.pdf',
    type: 'PDF',
    size: '3.1 MB',
    uploadDate: '2024-01-08',
    folder: 'Trabalho'
  }
];

export default function Documents() {
  const [folders, setFolders] = useState<Folder[]>(mockFolders);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocuments = documents.filter(doc => 
    (!selectedFolder || doc.folder === selectedFolder) &&
    (doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     doc.folder.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddFolder = (name: string, color: string) => {
    const folder: Folder = {
      id: Date.now().toString(),
      name,
      color,
      documentCount: 0
    };
    setFolders([...folders, folder]);
    setShowAddFolderModal(false);
  };

  const handleUploadDocument = (name: string, folder: string, file: File) => {
    const document: Document = {
      id: Date.now().toString(),
      name,
      type: file.type.split('/')[1].toUpperCase(),
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split('T')[0],
      folder
    };
    setDocuments([document, ...documents]);
    
    // Update folder document count
    setFolders(folders.map(f => 
      f.name === folder 
        ? { ...f, documentCount: f.documentCount + 1 }
        : f
    ));
    
    setShowUploadModal(false);
  };

  const handleDeleteDocument = (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (doc) {
      setDocuments(documents.filter(d => d.id !== id));
      setFolders(folders.map(f => 
        f.name === doc.folder 
          ? { ...f, documentCount: Math.max(0, f.documentCount - 1) }
          : f
      ));
    }
  };

  const handleDeleteFolder = (id: string) => {
    const folder = folders.find(f => f.id === id);
    if (folder) {
      setDocuments(documents.filter(d => d.folder !== folder.name));
      setFolders(folders.filter(f => f.id !== id));
      if (selectedFolder === folder.name) {
        setSelectedFolder(null);
      }
    }
  };

  const totalDocuments = documents.length;
  const totalSize = documents.reduce((sum, doc) => {
    const size = parseFloat(doc.size.split(' ')[0]);
    return sum + size;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Documentos</h1>
          <p className="text-gray-500 mt-1">Organize seus documentos importantes</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowAddFolderModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Pasta</span>
          </button>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
          >
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total de Documentos</p>
              <p className="text-3xl font-bold mt-1">{totalDocuments}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <FileText className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Pastas</p>
              <p className="text-3xl font-bold mt-1">{folders.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <FolderOpen className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Espaço Usado</p>
              <p className="text-3xl font-bold mt-1">{totalSize.toFixed(1)} MB</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Upload className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Busca e filtros */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSelectedFolder(null)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                !selectedFolder
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
          </div>
        </div>
      </div>

      {/* Pastas */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Pastas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedFolder === folder.name
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
              onClick={() => setSelectedFolder(selectedFolder === folder.name ? null : folder.name)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${folder.color}`}>
                  <FolderOpen className="h-5 w-5 text-white" />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFolder(folder.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <h3 className="font-medium text-gray-800 mb-1">{folder.name}</h3>
              <p className="text-sm text-gray-500">{folder.documentCount} documentos</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de documentos */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            {selectedFolder ? `Documentos - ${selectedFolder}` : 'Todos os Documentos'}
          </h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {filteredDocuments.map((document) => (
            <div key={document.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-800">{document.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500">{document.folder}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">{document.type}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">{document.size}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">
                        {new Date(document.uploadDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteDocument(document.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de adicionar pasta */}
      {showAddFolderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Nova Pasta</h2>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleAddFolder(
                formData.get('name') as string,
                formData.get('color') as string
              );
            }} className="p-6 space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Nome da pasta"
                required
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cor da pasta</label>
                <div className="grid grid-cols-6 gap-3">
                  {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500', 'bg-yellow-500'].map(color => (
                    <label key={color} className="cursor-pointer">
                      <input type="radio" name="color" value={color} className="sr-only" required />
                      <div className={`w-8 h-8 rounded-lg ${color} border-2 border-transparent hover:border-gray-300 transition-colors duration-200`}></div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddFolderModal(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de upload */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Upload de Documento</h2>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const file = (formData.get('file') as File);
              if (file) {
                handleUploadDocument(
                  formData.get('name') as string || file.name,
                  formData.get('folder') as string,
                  file
                );
              }
            }} className="p-6 space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Nome do documento"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              
              <select
                name="folder"
                required
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">Selecione uma pasta</option>
                {folders.map(folder => (
                  <option key={folder.id} value={folder.name}>
                    {folder.name}
                  </option>
                ))}
              </select>
              
              <input
                type="file"
                name="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                required
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}