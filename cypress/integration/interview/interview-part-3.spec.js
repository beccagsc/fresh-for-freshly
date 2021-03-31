// TODO: The second test fails on Firefox with error 'Removing cookie failed for: {"url":"https://www.freshly.com/","name":"ajs_anonymous_id"}'

// Return string formatted like 2021-08-28
const twoWeeksFromToday = () => {
  let currentTime = new Date();
  currentTime.setDate(currentTime.getDate()+14);
  let month = currentTime.getMonth() + 1;
  if (month < 10 ) {
    month = '0' + month;
  }
  let day = currentTime.getDate();
  if (day < 10 ) {
    day = '0' + day;    
  }
  let year = currentTime.getFullYear();
  return (year + '-' + month + '-' + day);
}

describe('Ordering your first Freshly meal', () => {
  const orderDate = twoWeeksFromToday();
  const customerEmail = 'bob@sweet.home.alabama.com';
  const customerZip = '35125';

  it('Submitting a valid email and zip code opens the choose a plan page', () => {
    cy.server();
    cy.route('POST', 'https://www.freshly.com/join_now_data').as('availabilityCheck');

    // [ ] Visit 'www.freshly.com/subscriptions/new'
    cy.visit('www.freshly.com/subscriptions/new');
    // [ ] Should see form with email and zipcode fields
    // [ ] Enter email and zipcode (35125 is a usable zipcode)
    cy.findByTestId('email-field').clear().type(customerEmail);
    cy.findByTestId('zip-field').clear().type(customerZip);
    cy.findByTestId('get-started-form-submit-button').click();
    // [ ] Should see 'choose a plan' section
    cy.wait('@availabilityCheck').its('status').should('eq', 200);
    cy.contains('Choose a Plan');
  });

  it('A customer can select a meal plan and delivery day', () => {
    const zipUrl = `https://www.freshly.com/join-now/plan?brand=core&zip=${customerZip}`
    cy.visit(zipUrl);
    // [ ] Select a meal plan
    cy.contains('Select the 4 meals plan').click({ force: true });
    // [ ] Should see 'choose a delivery day' section
    cy.contains('Choose a delivery day');
    // [ ] Select a delivery day from available options
    cy.get(`[name=${orderDate}]`).click();
    // [ ] Click 'Next'
    cy.findByTestId('submit-date').click();
    // [ ] Should see 'meal selection' section
    cy.get('.page-choose_meals').should('exist');
    // [ ] Select number of meals to match selected plan
    for (let i = 0; i < 4; i++) {
      cy.findByLabelText('Add Steak Peppercorn to delivery').click();
    }
    // [ ] Click 'Next'
    cy.get('[data-test-type=cart__confirm-button]').click();
  });

  it('A customer can confirm and finalize their order', () => {
    const checkoutUrl = `https://www.freshly.com/join-now/checkout?brand=core&delivery_dates=${orderDate}&meal_ids=696807%2C696807%2C696807%2C696807&plan_id=425&zip=${customerZip}`
    cy.visit(checkoutUrl);
    // [ ] Should see 'checkout' section
    cy.contains('Checkout');
    // [ ] Should see 'Order Summary' panel with accurate info
    cy.contains('Order Summary');
    //TODO: verify Delivery Date
    cy.get('#order-summary').contains('4 Meals Per Week');
    // [ ] Should see 'My Meals' panel with accurate info
    cy.contains('My Meals');
    cy.get('.my-meals-item').contains('4');
    cy.get('.my-meals-item').contains('Steak Peppercorn');
    cy.get('.my-meals-item').contains('with Sautéed Carrots & French Green Beans');
    // [ ] Should see 3 steps: Create Account, Delivery Address, Payment Info
    // ?? Only see Delivery Address
    // [ ] Should start on Create Account step
    // [ ] Complete 'create account' form
    cy.get('#first_name').clear().type('Bob');
    cy.get('#last_name').clear().type('Smith');
    cy.get('#full_name').should('have.value', 'Bob Smith');
    cy.get('#full_name_disabled').should('be.checked');
    // [ ] Should be on Delivery Address step
    // [ ] Complete the 'delivery address' form
    cy.get('#line1').clear().type('2401 Comer Ave');
    cy.get('#city').should('have.value', 'Pell City');
    cy.get('#zip').should('have.value', customerZip);
    cy.get('#phone').clear().type('351-253-5125')
    cy.get('#agreed_to_receivesms').should('be.checked');
    cy.get('#email').clear().type(customerEmail);
    // [ ] Click 'Next'
    cy.findByRole('button', { name: 'Next' }).click()
    // [ ] Should be on 'Payment Info' step
    cy.contains('Payment Info')
    // [ ] Complete 'payment info form'    
  });
});


