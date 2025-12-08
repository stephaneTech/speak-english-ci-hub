import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  HelpCircle,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Save,
  X,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  difficulty: string;
  category: string;
  display_order: number | null;
  is_active: boolean | null;
}

const QuestionsManager = () => {
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<TestQuestion | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Form state
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correct_answer: 0,
    difficulty: 'A1',
    category: 'grammar',
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('test_questions')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Erreur lors du chargement des questions');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (question?: TestQuestion) => {
    if (question) {
      setFormData({
        question: question.question,
        options: question.options.length === 4 ? question.options : [...question.options, '', '', '', ''].slice(0, 4),
        correct_answer: question.correct_answer,
        difficulty: question.difficulty,
        category: question.category,
        display_order: question.display_order || 0,
        is_active: question.is_active ?? true,
      });
      setEditingQuestion(question);
    } else {
      setFormData({
        question: '',
        options: ['', '', '', ''],
        correct_answer: 0,
        difficulty: 'A1',
        category: 'grammar',
        display_order: questions.length + 1,
        is_active: true,
      });
      setEditingQuestion(null);
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.question.trim() || formData.options.some(o => !o.trim())) {
      toast.error('Tous les champs sont requis');
      return;
    }

    setIsSaving(true);
    try {
      const questionData = {
        question: formData.question,
        options: formData.options,
        correct_answer: formData.correct_answer,
        difficulty: formData.difficulty,
        category: formData.category,
        display_order: formData.display_order,
        is_active: formData.is_active,
      };

      if (editingQuestion) {
        const { error } = await supabase
          .from('test_questions')
          .update(questionData)
          .eq('id', editingQuestion.id);
        
        if (error) throw error;
        toast.success('Question modifiée avec succès');
      } else {
        const { error } = await supabase
          .from('test_questions')
          .insert(questionData);
        
        if (error) throw error;
        toast.success('Question créée avec succès');
      }

      setIsDialogOpen(false);
      fetchQuestions();
    } catch (error) {
      console.error('Error saving question:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) return;

    try {
      const { error } = await supabase
        .from('test_questions')
        .delete()
        .eq('id', questionId);
      
      if (error) throw error;
      toast.success('Question supprimée');
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const toggleActive = async (question: TestQuestion) => {
    try {
      const { error } = await supabase
        .from('test_questions')
        .update({ is_active: !question.is_active })
        .eq('id', question.id);
      
      if (error) throw error;
      toast.success(question.is_active ? 'Question désactivée' : 'Question activée');
      fetchQuestions();
    } catch (error) {
      console.error('Error toggling question:', error);
      toast.error('Erreur');
    }
  };

  const filteredQuestions = questions.filter(q => {
    if (filterDifficulty !== 'all' && q.difficulty !== filterDifficulty) return false;
    if (filterCategory !== 'all' && q.category !== filterCategory) return false;
    return true;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'A1': return 'bg-green-100 text-green-800';
      case 'A2': return 'bg-lime-100 text-lime-800';
      case 'B1': return 'bg-yellow-100 text-yellow-800';
      case 'B2': return 'bg-orange-100 text-orange-800';
      case 'C1': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-secondary" />
          <h2 className="text-xl font-heading font-bold">Questions du Test</h2>
          <span className="text-sm text-muted-foreground">({filteredQuestions.length})</span>
        </div>
        <Button onClick={() => openEditDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Question
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Niveau" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous niveaux</SelectItem>
            <SelectItem value="A1">A1</SelectItem>
            <SelectItem value="A2">A2</SelectItem>
            <SelectItem value="B1">B1</SelectItem>
            <SelectItem value="B2">B2</SelectItem>
            <SelectItem value="C1">C1</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="grammar">Grammaire</SelectItem>
            <SelectItem value="vocabulary">Vocabulaire</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filteredQuestions.map((question) => (
          <div 
            key={question.id} 
            className={`bg-card rounded-xl p-4 border ${question.is_active ? 'border-border' : 'border-border/50 opacity-60'}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                    {question.category === 'grammar' ? 'Grammaire' : 'Vocabulaire'}
                  </span>
                  {!question.is_active && (
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-xs">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="font-medium mb-2">{question.question}</p>
                <div className="flex flex-wrap gap-2 text-sm">
                  {question.options.map((option, idx) => (
                    <span 
                      key={idx}
                      className={`px-2 py-1 rounded ${
                        idx === question.correct_answer 
                          ? 'bg-green-100 text-green-800 font-medium' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {option}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => toggleActive(question)}
                  title={question.is_active ? 'Désactiver' : 'Activer'}
                >
                  {question.is_active ? (
                    <XCircle className="w-4 h-4 text-orange-500" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </Button>
                <Button variant="outline" size="icon" onClick={() => openEditDialog(question)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(question.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingQuestion ? 'Modifier la Question' : 'Nouvelle Question'}</DialogTitle>
            <DialogDescription>
              {editingQuestion ? 'Modifiez les informations de la question' : 'Créez une nouvelle question pour le test'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="q-question">Question</Label>
              <Textarea
                id="q-question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="What ___ your name?"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Options (4 réponses)</Label>
              {formData.options.map((option, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...formData.options];
                      newOptions[idx] = e.target.value;
                      setFormData({ ...formData, options: newOptions });
                    }}
                    placeholder={`Option ${idx + 1}`}
                  />
                  <Button
                    type="button"
                    variant={formData.correct_answer === idx ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setFormData({ ...formData, correct_answer: idx })}
                    title="Définir comme réponse correcte"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">Cliquez sur ✓ pour définir la bonne réponse</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="q-difficulty">Niveau</Label>
                <Select 
                  value={formData.difficulty} 
                  onValueChange={(v) => setFormData({ ...formData, difficulty: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A1">A1 - Débutant</SelectItem>
                    <SelectItem value="A2">A2 - Élémentaire</SelectItem>
                    <SelectItem value="B1">B1 - Intermédiaire</SelectItem>
                    <SelectItem value="B2">B2 - Intermédiaire+</SelectItem>
                    <SelectItem value="C1">C1 - Avancé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="q-category">Catégorie</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(v) => setFormData({ ...formData, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grammar">Grammaire</SelectItem>
                    <SelectItem value="vocabulary">Vocabulaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="q-active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="q-active">Question active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionsManager;