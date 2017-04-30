const fs = require('fs');
const TableModel = require('../table-model');
const TableView = require('../table-view');


describe('table-view', () => {

  beforeEach(() => {
  	// load HTML skeleton from disk and parse into the DOM
    const fixturePath = './client/js/test/fixtures/sheet-container.html';
    const html = fs.readFileSync(fixturePath, 'utf8');
    document.documentElement.innerHTML = html;  	
  });

   describe('column addition functionality', () => {
    it('makes changes TO the value of cells within a column', () => {
      // set up the inital state
      const numCols = 10;
      const numRows = 21;
      const model = new TableModel(numCols, numRows);
      const view = new TableView(model);
      view.init();

      // inspect the intial state
      let ths = document.querySelectorAll('TBODY TR');
      expect(ths.length).toBe(numRows);


      // simulate user action
      model.setValue({col: 0, row: 1}, '123');
      model.setValue({col: 0, row: 2}, '321');
      view.addNumToLastRow();

      // inspect the resulting state
      let ted = model.getValue({col: 0, row: 20});
      expect(ted).toBe(444);
    });
});

  describe('formula bar', () => {
    it('makes changes TO the value of the current cell', () => {
      // set up the inital state
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      view.init();

      // inspect the intial state
      let trs = document.querySelectorAll('TBODY TR');
      let td = trs[0].cells[0];
      expect(td.textContent).toBe('');

      // simulate user action
      document.querySelector('#formula-bar').value = 65;
      view.handleFormulaBarChange();

      // inspect the resulting state
      trs = document.querySelectorAll('TBODY TR');
      expect(trs[0].cells[0].textContent).toBe('65');
    });


    it('updates FROM the value of the current cell', () => {
      // set up the initial state
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      model.setValue({col: 2, row: 1}, '123');
      view.init();

      // inspect the inital state
      const formulaBarEl = document.querySelector('#formula-bar');
      expect(formulaBarEl.value).toBe('');

      // simulate user action
      const trs = document.querySelectorAll('TBODY TR');
      trs[1].cells[2].click();

      // inspect the resulting state
      expect(formulaBarEl.value).toBe('123');
    });
  });

  describe('table body', () => {
    it('highlights the current cell when clicked', ()=> {
      // set up the initial state
      const model = new TableModel(10, 5);
      const view = new TableView(model);
      view.init();

      // inspect the initial state
      let trs = document.querySelectorAll('TBODY TR');
      let td = trs[2].cells[3];
      expect(td.className).toBe('');

      // simulate user action
      td.click();

      // inspect the resulting state
      trs = document.querySelectorAll('TBODY TR');
      td = trs[2].cells[3];
      expect(td.className).not.toBe('');
    });

    it ('has the right size', () => {
       //set up the initial state
       const numCols = 6;
       const numRows = 10;
       const model = new TableModel(numCols, numRows);
       const view = new TableView(model);
       view.init();

       //inspect the initial state
       let ths = document.querySelectorAll('THEAD TH');
       expect(ths.length).toBe(numCols);
    });

    it('fills in values from the model', () => {
       //set up the initial state
       const model = new TableModel(3, 3);
       const view = new TableView(model);
       model.setValue({col: 2, row: 1}, '123');
       view.init();

       //inspect the initial state
       const trs = document.querySelectorAll('TBODY TR');
       expect(trs[1].cells[2].textContent).toBe('123');
    });
  });

  describe('table header', () => {
  	it('has valid column header labels', () => {
  		// set up the intial state
  		const numCols = 6;
  		const numRows = 10;
  		const model = new TableModel(numCols, numRows);
  		const view = new TableView(model);
  		view.init();

  		// inspect the initial state
  		let ths = document.querySelectorAll('THEAD TH');
  		expect(ths.length).toBe(numCols);

  		let labelTexts = Array.from(ths).map(el => el.textContent);
  		expect(labelTexts).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
  	});
  });

});