const loanRepository = require('../repositories/loanRepository');
const bookRepository = require('../repositories/bookRepository');

const MAX_ACTIVE_LOANS = 3;

module.exports = {
  listAll() {
    return loanRepository.findAll();
  },

  listByUser(userId) {
    return loanRepository.findByUserId(userId);
  },

  borrow(userId, bookId) {
    const book = bookRepository.findById(bookId);
    if (!book) return { error: 'Livro nao encontrado' };
    if (book.available <= 0) return { error: 'Livro indisponivel no momento' };

    const activeLoan = loanRepository.findActiveLoan(userId, bookId);
    if (activeLoan) return { error: 'Voce ja possui um emprestimo ativo deste livro' };

    const activeCount = loanRepository.countActiveByUser(userId);
    if (activeCount >= MAX_ACTIVE_LOANS) {
      return { error: `Limite de ${MAX_ACTIVE_LOANS} emprestimos ativos atingido` };
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 dias de prazo

    const id = loanRepository.create({ userId, bookId, dueDate: dueDate.toISOString() });
    bookRepository.decrementAvailable(bookId);

    return { success: true, id };
  },

  returnBook(loanId, userId, userRole) {
    const loan = loanRepository.findById(loanId);
    if (!loan) return { error: 'Emprestimo nao encontrado' };
    if (loan.status === 'devolvido') return { error: 'Livro ja devolvido' };

    if (userRole !== 'admin' && loan.user_id !== userId) {
      return { error: 'Sem permissao para devolver este emprestimo' };
    }

    loanRepository.returnLoan(loanId);
    bookRepository.incrementAvailable(loan.book_id);

    return { success: true };
  },
};
