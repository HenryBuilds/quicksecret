describe("Note Reading", () => {
  let noteId: string;
  let noteUrl: string;

  beforeEach(() => {
    cy.request("POST", "/api/notes", {
      content: "Test note content for reading",
      maxViews: 1,
    }).then((response) => {
      expect(response.status).to.eq(201);
      noteId = response.body.id;
      noteUrl = `/note?id=${noteId}`;
      cy.log(`Created note with ID: ${noteId}`);
      cy.log(`Note URL: ${noteUrl}`);
    });
  });

  it("should display confirmation dialog before reading", () => {
    cy.visit(noteUrl);
    cy.url().should("include", `id=${noteId}`);

    cy.contains("Ready to Reveal?").should("be.visible");
    cy.contains("This note will self-destruct after reading").should(
      "be.visible"
    );
    cy.contains("1 view remaining").should("be.visible");
    cy.contains("Reveal Note").should("be.visible");
    cy.contains("Delete Forever").should("be.visible");
  });

  it("should reveal note content after confirmation", () => {
    cy.visit(noteUrl);
    cy.url().should("include", `id=${noteId}`);

    cy.contains("Reveal Note").should("be.visible");
    cy.contains("Reveal Note").click();

    cy.contains("Test note content for reading", { timeout: 10000 }).should(
      "be.visible"
    );
    cy.contains("Secret Note").should("be.visible");
    cy.contains("View 1").should("be.visible");
  });

  it("should delete note when delete button is clicked", () => {
    cy.visit(noteUrl);
    cy.contains("Delete Forever").click();
    cy.contains("Note Deleted").should("be.visible");
    cy.contains("permanently removed and cannot be recovered").should(
      "be.visible"
    );
  });
});

describe("Password Protected Notes", () => {
  let noteId: string;
  let noteUrl: string;
  const testPassword = "testpassword123";

  beforeEach(() => {
    cy.request("POST", "/api/notes", {
      content: "Secret encrypted content",
      password: testPassword,
      maxViews: 2,
    }).then((response) => {
      expect(response.status).to.eq(201);
      noteId = response.body.id;
      noteUrl = `/note?id=${noteId}`;
    });
  });

  it("should show password input for encrypted notes", () => {
    cy.visit(noteUrl);
    cy.contains("Password Protected").should("be.visible");
    cy.contains("Reveal Note").click();
    cy.contains("Protected Note").should("be.visible");
    cy.contains("Enter the password to unlock this note").should("be.visible");
    cy.get("#password").should("be.visible");
  });

  //   it("should unlock note with correct password", () => {
  //     cy.visit(noteUrl);
  //     cy.contains("Reveal Note").click();
  //     cy.get("#password").should("be.visible");
  //     cy.get("#password").type(testPassword);
  //     cy.contains("Unlock").click();
  //     cy.wait(1000);
  //     cy.contains("Secret encrypted content").should("be.visible");
  //   });

  //   it("should show error with incorrect password", () => {
  //     cy.visit(noteUrl);
  //     cy.contains("Reveal Note").click();
  //     cy.get("#password").should("be.visible");
  //     cy.get("#password").type("wrongpassword");
  //     cy.contains("Unlock").click();
  //     cy.wait(2000);
  //     cy.contains("Incorrect password. Please try again.").should("be.visible");
  //     cy.get("#password").should("be.visible");
  //   });
});
