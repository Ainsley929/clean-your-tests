const { expect } = require('chai')
const { describe, it } = require('mocha')
const employee = require('./employee')
const products = require('./products')
const pricing = require('../pricing')

describe('pricing', () => {
  describe('formatPrice', () => {
    it('returns the price given, truncated to two decimal places', () => {
      const formattedPrice = pricing.formatPrice(15.335)
      expect(formattedPrice).to.equal(15.33)
    })

    describe('getEmployerContribution', () => {
      it('returns the contribution amount from the product when the contribution type is dollars', () => {
        const contribution = pricing.getEmployerContribution(products.longTermDisability.employerContribution, 15.33)
        expect(contribution).to.equal(10)
      })
      it('returns the calculated contribution (percent of price) when the contribution type is a percentage', () => {
        const contribution = pricing.getEmployerContribution(products.longTermDisability.employerContribution, 15.33)
        expect(contribution).to.equal(10)
      })
    })
  })
  describe('calculateVolLifePricePerRole', () => {
    it('returns the price of vol life coverage for a particular role (ee)', () => {
      //define test data
      const coverageLevel = [{ role: 'ee', coverage: 125000 }]
      //call the func under test with data
      const price = pricing.calculateVolLifePricePerRole('ee', coverageLevel, products.voluntaryLife.costs)
      //expect good things
      expect(price).to.equal(43.75)
    })
  })
  describe('calculateVolLifePrice', () => {
    it('returns the price (pre employer contribution) for vol life product based on user selection', () => {
      const selectedOptions = {
        familyMembersToCover: ['ee', 'sp'],
        coverageLevel: [
          { role: 'ee', coverage: 200000 },
          { role: 'sp', coverage: 75000 }]
      }
      const price = pricing.calculateVolLifePrice(products.voluntaryLife, selectedOptions)
      expect(price).to.equal(79)
    })
  })

  describe(' calculateLTDPrice', () => {
    it('returns the price of ltd if the persons role is ee', () => {
      const selectedOptions = {
        familyMembersToCover: ['ee'],
        coverageLevel: [{ role: 'ee', coverage: 125000 }]
      }
      const price = pricing.calculateLTDPrice(products.longTermDisability, employee, selectedOptions)

      expect(price).to.equal(32.04)
    })
    it('returns false if the role is not ee', () => {
      const selectedOptions = {
        familyMembersToCover: ['sp']
      }
      const price = pricing.calculateLTDPrice(products.longTermDisability, employee, selectedOptions)


      expect(price).to.equal(0)
    })
  })

  describe('calculateProductPrice', () => {
    it('returns the price for a voluntary life product for a single employee', () => {
      const selectedOptions = {
        familyMembersToCover: ['ee'],
        coverageLevel: [{ role: 'ee', coverage: 125000 }],
      }
      const price = pricing.calculateProductPrice(products.voluntaryLife, employee, selectedOptions)

      expect(price).to.equal(39.37)
    })

    it('returns the price for a voluntary life product for an employee with a spouse', () => {
      const selectedOptions = {
        familyMembersToCover: ['ee', 'sp'],
        coverageLevel: [
          { role: 'ee', coverage: 200000 },
          { role: 'sp', coverage: 75000 },
        ],
      }
      const price = pricing.calculateProductPrice(products.voluntaryLife, employee, selectedOptions)

      expect(price).to.equal(71.09)
    })

    it('returns the price for a disability product for an employee', () => {
      const selectedOptions = {
        familyMembersToCover: ['ee']
      }
      const price = pricing.calculateProductPrice(products.longTermDisability, employee, selectedOptions)

      expect(price).to.equal(22.04)
    })

    it('throws an error on unknown product type', () => {
      const unknownProduct = { type: 'vision' }

      expect(() => pricing.calculateProductPrice(unknownProduct, {}, {})).to.throw('Unknown product type: vision')
    })
  })
})