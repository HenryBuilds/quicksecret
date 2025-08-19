describe("Note Creation", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should create a simple note successfully", () => {
    const testContent = "This is a test secret note";

    cy.get('textarea[placeholder*="secret message"]').type(testContent);
    cy.get('button[type="submit"]').click();

    cy.get('[role="dialog"]').should("be.visible");
    cy.contains("Note Created Successfully!").should("be.visible");

    cy.get("code").should("contain", "http://localhost:3000/note?id=");
  });

  it("should create a password protected note", () => {
    const testContent = "Secret password-protected message";
    const testPassword = "mysecretpassword123";

    cy.get('textarea[placeholder*="secret message"]').type(testContent);
    cy.get('input[type="password"]').type(testPassword);

    cy.get('button[type="submit"]').click();

    cy.get('[role="dialog"]').should("be.visible");
    cy.contains("Note Created Successfully").should("be.visible");
  });

  it('should set max views', () => {
    const testContent = 'Multi-view note'

    cy.get('textarea[placeholder*="secret message"]').type(testContent)
    
    cy.get('[role="slider"]').as('slider')
    
    cy.get('@slider').focus()
    cy.get('@slider').type('{rightarrow}{rightarrow}{rightarrow}', { force: true })
    

    
    cy.get('button[type="submit"]').click()
    
    cy.contains('Note Created Successfully').should('be.visible')
  })

  it('should not submit empty note', () => {
    cy.get('button[type="submit"]').should('be.disabled')
  })
});