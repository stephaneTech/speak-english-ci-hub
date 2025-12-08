import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { ClipboardCheck, ArrowRight, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const questions = [
  {
    id: 1,
    question: "What is the correct form of the verb?",
    sentence: "She ___ to the store yesterday.",
    options: ["go", "goes", "went", "going"],
    correct: 2,
  },
  {
    id: 2,
    question: "Choose the correct article:",
    sentence: "___ apple a day keeps the doctor away.",
    options: ["A", "An", "The", "No article"],
    correct: 1,
  },
  {
    id: 3,
    question: "Which word is a synonym of 'happy'?",
    sentence: "",
    options: ["Sad", "Joyful", "Angry", "Tired"],
    correct: 1,
  },
  {
    id: 4,
    question: "Complete the sentence:",
    sentence: "If I ___ rich, I would travel the world.",
    options: ["am", "was", "were", "be"],
    correct: 2,
  },
  {
    id: 5,
    question: "Choose the correct preposition:",
    sentence: "I'm interested ___ learning English.",
    options: ["in", "on", "at", "for"],
    correct: 0,
  },
  {
    id: 6,
    question: "What is the plural of 'child'?",
    sentence: "",
    options: ["Childs", "Childes", "Children", "Childrens"],
    correct: 2,
  },
  {
    id: 7,
    question: "Select the correct tense:",
    sentence: "By next year, I ___ English for 5 years.",
    options: ["will study", "will be studying", "will have studied", "study"],
    correct: 2,
  },
  {
    id: 8,
    question: "Choose the correct word:",
    sentence: "There are ___ people at the party.",
    options: ["much", "many", "a lot", "few of"],
    correct: 1,
  },
  {
    id: 9,
    question: "What does 'postpone' mean?",
    sentence: "",
    options: ["Cancel", "Delay", "Start", "Finish"],
    correct: 1,
  },
  {
    id: 10,
    question: "Choose the correct conditional:",
    sentence: "If it rains tomorrow, we ___ inside.",
    options: ["stay", "stayed", "will stay", "would stay"],
    correct: 2,
  },
  {
    id: 11,
    question: "What is the past participle of 'write'?",
    sentence: "",
    options: ["Wrote", "Written", "Writing", "Writed"],
    correct: 1,
  },
  {
    id: 12,
    question: "Choose the correct word:",
    sentence: "She speaks English ___.",
    options: ["good", "well", "goodly", "better"],
    correct: 1,
  },
  {
    id: 13,
    question: "Complete the sentence:",
    sentence: "I have been waiting ___ two hours.",
    options: ["since", "for", "during", "while"],
    correct: 1,
  },
  {
    id: 14,
    question: "What is the opposite of 'expensive'?",
    sentence: "",
    options: ["Rich", "Cheap", "Poor", "Free"],
    correct: 1,
  },
  {
    id: 15,
    question: "Choose the correct form:",
    sentence: "He suggested ___ a movie.",
    options: ["to watch", "watching", "watch", "watched"],
    correct: 1,
  },
  {
    id: 16,
    question: "What does 'nevertheless' mean?",
    sentence: "",
    options: ["Therefore", "However", "Because", "Although"],
    correct: 1,
  },
  {
    id: 17,
    question: "Choose the correct sentence:",
    sentence: "",
    options: [
      "She don't like coffee.",
      "She doesn't likes coffee.",
      "She doesn't like coffee.",
      "She not like coffee."
    ],
    correct: 2,
  },
  {
    id: 18,
    question: "Complete with the correct pronoun:",
    sentence: "This book is ___. I bought it yesterday.",
    options: ["my", "me", "mine", "I"],
    correct: 2,
  },
  {
    id: 19,
    question: "What is a synonym of 'begin'?",
    sentence: "",
    options: ["End", "Start", "Stop", "Finish"],
    correct: 1,
  },
  {
    id: 20,
    question: "Choose the correct comparative:",
    sentence: "This car is ___ than that one.",
    options: ["more fast", "faster", "most fast", "fastest"],
    correct: 1,
  },
  {
    id: 21,
    question: "Complete the sentence:",
    sentence: "I wish I ___ speak French fluently.",
    options: ["can", "could", "will", "would"],
    correct: 1,
  },
  {
    id: 22,
    question: "What does 'approximately' mean?",
    sentence: "",
    options: ["Exactly", "About", "Never", "Always"],
    correct: 1,
  },
  {
    id: 23,
    question: "Choose the correct passive form:",
    sentence: "The cake ___ by my mother.",
    options: ["baked", "was baked", "is baking", "bakes"],
    correct: 1,
  },
  {
    id: 24,
    question: "Complete with the correct modal:",
    sentence: "You ___ wear a seatbelt in the car.",
    options: ["must", "can", "might", "could"],
    correct: 0,
  },
  {
    id: 25,
    question: "What is the meaning of 'to accomplish'?",
    sentence: "",
    options: ["To fail", "To achieve", "To forget", "To ignore"],
    correct: 1,
  },
];

const getLevel = (score: number) => {
  const percentage = (score / questions.length) * 100;
  if (percentage >= 90) return { level: "C1 - Avancé", description: "Excellent ! Vous avez un niveau avancé en anglais.", color: "text-primary" };
  if (percentage >= 70) return { level: "B2 - Intermédiaire Supérieur", description: "Très bien ! Vous avez un bon niveau d'anglais.", color: "text-secondary" };
  if (percentage >= 50) return { level: "B1 - Intermédiaire", description: "Bon début ! Vous pouvez progresser avec notre coaching.", color: "text-primary" };
  if (percentage >= 30) return { level: "A2 - Élémentaire", description: "Vous avez les bases. Le coaching vous aidera à progresser rapidement.", color: "text-orange" };
  return { level: "A1 - Débutant", description: "C'est le début de votre aventure ! Notre coaching est fait pour vous.", color: "text-muted-foreground" };
};

const TestNiveau = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correct ? 1 : 0);
    }, 0);
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResult(false);
    setTestStarted(false);
  };

  const score = calculateScore();
  const levelInfo = getLevel(score);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-hero-pattern overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary/10 blur-3xl" />
        </div>

        <div className="container relative">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Test de Niveau
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Évaluez votre niveau
              <span className="text-gradient"> d'anglais</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Testez gratuitement votre niveau d'anglais avec notre quiz de {questions.length} questions. 
              Recevez votre résultat immédiatement !
            </p>
          </div>
        </div>
      </section>

      {/* Test Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            {!testStarted ? (
              /* Start Screen */
              <div className="bg-card rounded-3xl p-8 md:p-12 shadow-soft text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <ClipboardCheck className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Prêt à commencer ?</h2>
                <p className="text-muted-foreground mb-8">
                  Ce test contient {questions.length} questions sur la grammaire et le vocabulaire anglais. 
                  Il ne prend que quelques minutes.
                </p>
                <Button size="lg" onClick={() => setTestStarted(true)}>
                  Commencer le test
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            ) : showResult ? (
              /* Results Screen */
              <div className="bg-card rounded-3xl p-8 md:p-12 shadow-soft">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-heading font-bold mb-2">Résultat du test</h2>
                  <p className="text-muted-foreground">Voici votre score et niveau estimé</p>
                </div>

                <div className="bg-muted/30 rounded-2xl p-6 mb-8 text-center">
                  <div className="text-5xl font-heading font-bold text-primary mb-2">
                    {score}/{questions.length}
                  </div>
                  <p className="text-lg font-semibold mb-1">{levelInfo.level}</p>
                  <p className="text-muted-foreground">{levelInfo.description}</p>
                </div>

                {/* Answer Review */}
                <div className="space-y-4 mb-8">
                  <h3 className="font-heading font-semibold text-lg">Détail des réponses</h3>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {questions.map((q, index) => (
                      <div key={q.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                        {answers[index] === q.correct ? (
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                        )}
                        <span className="text-sm flex-1">Question {index + 1}</span>
                        <span className="text-sm text-muted-foreground">
                          {q.options[q.correct]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" onClick={resetTest} className="flex-1">
                    <RotateCcw className="w-4 h-4" />
                    Refaire le test
                  </Button>
                  <Button variant="turquoise" className="flex-1" asChild>
                    <a href="/coaching">
                      Voir nos packs coaching
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              /* Question Screen */
              <div className="bg-card rounded-3xl p-8 md:p-12 shadow-soft">
                {/* Progress */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                      Question {currentQuestion + 1} sur {questions.length}
                    </span>
                    <span className="text-sm font-medium text-primary">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Question */}
                <div className="mb-8">
                  <h2 className="text-xl font-heading font-bold mb-2">
                    {questions[currentQuestion].question}
                  </h2>
                  {questions[currentQuestion].sentence && (
                    <p className="text-lg text-muted-foreground italic">
                      "{questions[currentQuestion].sentence}"
                    </p>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-3 mb-8">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 rounded-xl text-left transition-all duration-300 border-2 ${
                        selectedAnswer === index
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswer === index
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                        }`}>
                          {selectedAnswer === index && (
                            <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                          )}
                        </div>
                        <span className="font-medium">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}
                >
                  {currentQuestion < questions.length - 1 ? (
                    <>
                      Question suivante
                      <ArrowRight className="w-5 h-5" />
                    </>
                  ) : (
                    "Voir mes résultats"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TestNiveau;