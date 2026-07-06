export type TrustLevel = "Bronce" | "Plata" | "Oro" | "Platino";

export interface Borrower {
  id: string;
  name: string;
  initials: string;
  city: string;
  memberSince: string;
  trustLevel: TrustLevel;
  loansRepaid: number;
  totalBorrowed: number;
  onTimeRate: number; // 0-100
  incomeVerified: boolean;
  identityVerified: boolean;
  scorePoints: number; // 0-1000
  bio: string;
}

export interface Investor {
  borrowerId: string;
  amount: number;
}

export type LoanStatus = "financiando" | "activo" | "devuelto";

export interface Loan {
  id: string;
  borrowerId: string;
  title: string;
  purpose: string;
  amount: number;
  funded: number;
  interestRate: number; // annual %
  termMonths: number;
  riskGrade: "A+" | "A" | "B" | "C";
  status: LoanStatus;
  createdAt: string;
  contributions: Investor[];
}

// ---- Trust level metadata ----
export const TRUST_LEVELS: Record<
  TrustLevel,
  {
    color: "warning" | "neutral" | "primary" | "info";
    icon: string;
    minScore: number;
    perk: string;
  }
> = {
  Bronce: {
    color: "warning",
    icon: "i-lucide-shield",
    minScore: 0,
    perk: "Acceso a préstamos hasta 3.000 €",
  },
  Plata: {
    color: "neutral",
    icon: "i-lucide-shield-check",
    minScore: 400,
    perk: "Interés reducido y hasta 10.000 €",
  },
  Oro: {
    color: "warning",
    icon: "i-lucide-award",
    minScore: 650,
    perk: "Mejores tipos y hasta 25.000 €",
  },
  Platino: {
    color: "info",
    icon: "i-lucide-crown",
    minScore: 850,
    perk: "Tipos mínimos y hasta 50.000 €",
  },
};

export const INVESTMENT_TIERS = [10, 30, 40, 50, 70, 100] as const;

const borrowers: Borrower[] = [
  {
    id: "b1",
    name: "Lucía Fernández",
    initials: "LF",
    city: "Valencia",
    memberSince: "2021",
    trustLevel: "Platino",
    loansRepaid: 12,
    totalBorrowed: 48200,
    onTimeRate: 100,
    incomeVerified: true,
    identityVerified: true,
    scorePoints: 928,
    bio: "Diseñadora freelance con ingresos estables verificados. Historial impecable en 12 préstamos.",
  },
  {
    id: "b2",
    name: "Marc Oliver",
    initials: "MO",
    city: "Barcelona",
    memberSince: "2022",
    trustLevel: "Oro",
    loansRepaid: 7,
    totalBorrowed: 21500,
    onTimeRate: 98,
    incomeVerified: true,
    identityVerified: true,
    scorePoints: 742,
    bio: "Pequeño comerciante ampliando su negocio local. Buen historial de pagos puntuales.",
  },
  {
    id: "b3",
    name: "Aicha Benali",
    initials: "AB",
    city: "Madrid",
    memberSince: "2023",
    trustLevel: "Plata",
    loansRepaid: 3,
    totalBorrowed: 6800,
    onTimeRate: 96,
    incomeVerified: true,
    identityVerified: true,
    scorePoints: 512,
    bio: "Enfermera consolidando deudas a un tipo más justo. Ingresos verificados.",
  },
  {
    id: "b4",
    name: "Diego Ramírez",
    initials: "DR",
    city: "Sevilla",
    memberSince: "2024",
    trustLevel: "Bronce",
    loansRepaid: 1,
    totalBorrowed: 1500,
    onTimeRate: 90,
    incomeVerified: false,
    identityVerified: true,
    scorePoints: 318,
    bio: "Nuevo en la plataforma, construyendo su historial de confianza.",
  },
  {
    id: "b5",
    name: "Elena Costa",
    initials: "EC",
    city: "Bilbao",
    memberSince: "2021",
    trustLevel: "Oro",
    loansRepaid: 9,
    totalBorrowed: 33400,
    onTimeRate: 99,
    incomeVerified: true,
    identityVerified: true,
    scorePoints: 801,
    bio: "Autónoma del sector tecnológico. Financia proyectos con devoluciones anticipadas.",
  },
];

const loans: Loan[] = [
  {
    id: "l1",
    borrowerId: "b1",
    title: "Renovación de equipo de trabajo",
    purpose: "Compra de material profesional para ampliar servicios de diseño.",
    amount: 10000,
    funded: 7300,
    interestRate: 5.4,
    termMonths: 24,
    riskGrade: "A+",
    status: "financiando",
    createdAt: "Hace 3 días",
    contributions: makeContributions(7300),
  },
  {
    id: "l2",
    borrowerId: "b2",
    title: "Ampliación de local comercial",
    purpose: "Reforma del local para incorporar una nueva línea de productos.",
    amount: 18000,
    funded: 18000,
    interestRate: 6.9,
    termMonths: 36,
    riskGrade: "A",
    status: "activo",
    createdAt: "Hace 1 mes",
    contributions: makeContributions(18000),
  },
  {
    id: "l3",
    borrowerId: "b3",
    title: "Consolidación de deudas",
    purpose: "Unificar varios créditos en una sola cuota más manejable.",
    amount: 4500,
    funded: 2100,
    interestRate: 8.2,
    termMonths: 18,
    riskGrade: "B",
    status: "financiando",
    createdAt: "Hace 1 día",
    contributions: makeContributions(2100),
  },
  {
    id: "l4",
    borrowerId: "b5",
    title: "Curso de especialización",
    purpose:
      "Formación avanzada para acceder a mejores oportunidades laborales.",
    amount: 6000,
    funded: 6000,
    interestRate: 6.1,
    termMonths: 24,
    riskGrade: "A",
    status: "devuelto",
    createdAt: "Hace 8 meses",
    contributions: makeContributions(6000),
  },
  {
    id: "l5",
    borrowerId: "b4",
    title: "Reparación de vehículo",
    purpose: "Arreglo del coche necesario para desplazarse al trabajo.",
    amount: 1200,
    funded: 480,
    interestRate: 11.5,
    termMonths: 12,
    riskGrade: "C",
    status: "financiando",
    createdAt: "Hace 5 horas",
    contributions: makeContributions(480),
  },
  {
    id: "l6",
    borrowerId: "b1",
    title: "Proyecto editorial independiente",
    purpose: "Financiación para autoeditar una colección ilustrada.",
    amount: 8000,
    funded: 5200,
    interestRate: 5.8,
    termMonths: 30,
    riskGrade: "A+",
    status: "financiando",
    createdAt: "Hace 2 días",
    contributions: makeContributions(5200),
  },
];

// Generate a plausible spread of small contributions summing to a total
function makeContributions(total: number): Investor[] {
  const result: Investor[] = [];
  let remaining = total;
  let i = 0;
  while (remaining > 0) {
    const amounts = [50, 100, 100, 150, 200, 250, 500] as const;
    const chunk = Math.min(remaining, amounts[i % amounts.length]!);
    result.push({ borrowerId: `inv${i}`, amount: chunk });
    remaining -= chunk;
    i++;
    if (i > 400) break;
  }
  return result;
}

export function useData() {
  const allBorrowers = useState<Borrower[]>("borrowers", () => borrowers);
  const allLoans = useState<Loan[]>("loans", () => loans);

  const getBorrower = (id: string) =>
    allBorrowers.value.find((b) => b.id === id);
  const getLoan = (id: string) => allLoans.value.find((l) => l.id === id);
  const loansByBorrower = (id: string) =>
    allLoans.value.filter((l) => l.borrowerId === id);

  function investInLoan(loanId: string, amount: number) {
    const loan = allLoans.value.find((l) => l.id === loanId);
    if (!loan) return;
    loan.funded = Math.min(loan.amount, loan.funded + amount);
    loan.contributions.push({ borrowerId: "you", amount });
    if (loan.funded >= loan.amount) loan.status = "activo";
  }

  function createLoan(
    loan: Omit<Loan, "id" | "funded" | "status" | "contributions" | "createdAt">
  ) {
    const newLoan: Loan = {
      ...loan,
      id: `l${allLoans.value.length + 1}${Date.now().toString().slice(-3)}`,
      funded: 0,
      status: "financiando",
      createdAt: "Justo ahora",
      contributions: [],
    };
    allLoans.value.unshift(newLoan);
    return newLoan;
  }

  return {
    allBorrowers,
    allLoans,
    getBorrower,
    getLoan,
    loansByBorrower,
    investInLoan,
    createLoan,
  };
}

export function formatEuro(value: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}
