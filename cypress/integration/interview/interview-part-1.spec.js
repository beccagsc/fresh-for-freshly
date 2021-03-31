describe('Interview', () => {
  //  ----- Users API -----  \\
  it('When /users api is called with no params then it returns all users ordered by email ascending', () => {
    let allEmails = [];
    cy.request('http://localhost:3000/users')
      .then((response) => {
        let allUsers = response.body;
        allUsers.forEach(user => {
          allEmails.push(user.email);
        });
        expect(allEmails).to.equal(allEmails.sort());
      });
  })
  it('When /users api is called with id, it returns correct user', () => {
    cy.request('http://localhost:3000/users/1')
    .then((response) => {
      expect(response.body.id).to.equal(1);
      expect(response.body.email).to.equal('lwindas0@tuttocitta.it');
      expect(response.body.subscription_id).to.equal(1);
    });
  })
  it('When /users api is called with email, it returns correct users', () => {
    // Todo
  })
  it('When /users api is called with subscription_id, it returns correct user', () => {
    // Todo
  })


  //  ----- Subscriptions API  -----  \\
  it('When /subscriptions api is called with id param then it returns subscription, user, and deliveries', () => {
    // Todo
  })
  it('When /subscriptions api is called with type param then it returns all subscriptions for given type', () => {
    // Todo
  })


  //  ----- Deliveries API  -----  \\
  it('When /deliveries api is called with id param then it returns subscription, user, and deliveries', () => {
    // Todo
  })
  it('When /deliveries api is called with subscription_id param then it returns all deliveries for given subscription_id', () => {
    // Todo
  })
})
