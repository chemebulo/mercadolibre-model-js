
class IdGenerator {
  currentUserId = 0;
  currentProductId = 0;
  currentCategoryId = 0;
  currentQuestionId = 0;

  getNextUserId() {
    this.currentUserId += 1
    return `u_${this.currentUserId}`
  }
  getNextProductId() {
    this.currentProductId += 1
    return `p_${this.currentProductId}`
  }
  getNextCategoryId() {
    this.currentCategoryId += 1
    return `c_${this.currentCategoryId}`
  }
  getNextQuestionId() {
    this.currentQuestionId += 1
    return `q_${this.currentQuestionId}`
  }
};

export default IdGenerator;
