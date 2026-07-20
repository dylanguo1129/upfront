export default {
  "cards": [
    {
      "id": "amex-cobalt",
      "issuer": "American Express",
      "name": "American Express Cobalt Card",
      "network": "amex",
      "category": "travel",
      "currencyId": "mr",
      "annualFeeCents": 19188,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "dining",
          "multiplier": 5,
          "monthlyCapSpendCents": 250000,
          "capPeriod": "monthly",
          "capOverflowMultiplier": 1
        },
        {
          "category": "groceries",
          "multiplier": 5,
          "monthlyCapSpendCents": 250000,
          "capPeriod": "monthly",
          "capOverflowMultiplier": 1
        },
        {
          "category": "entertainment",
          "multiplier": 3
        },
        {
          "category": "gas",
          "multiplier": 2
        },
        {
          "category": "transit",
          "multiplier": 2
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 15000,
            "minSpendCents": 900000,
            "windowMonths": 12
          }
        ],
        "typicalPoints": 40000,
        "bestPoints": 50000,
        "eligibilityRule": "once_per_lifetime"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "amex-gold-rewards",
      "issuer": "American Express",
      "name": "American Express Gold Rewards Card",
      "network": "amex",
      "category": "travel",
      "currencyId": "mr",
      "annualFeeCents": 25000,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "travel",
          "multiplier": 2
        },
        {
          "category": "gas",
          "multiplier": 2
        },
        {
          "category": "groceries",
          "multiplier": 2
        },
        {
          "category": "drugstore",
          "multiplier": 2
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 10000,
            "minSpendCents": 100,
            "windowMonths": 1
          },
          {
            "amount": 60000,
            "minSpendCents": 1200000,
            "windowMonths": 12
          }
        ],
        "typicalPoints": 60000,
        "bestPoints": 110000,
        "eligibilityRule": "once_per_lifetime"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "amex-platinum",
      "issuer": "American Express",
      "name": "The Platinum Card",
      "network": "amex",
      "category": "travel",
      "currencyId": "mr",
      "annualFeeCents": 79900,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "excellent",
      "earnRules": [
        {
          "category": "dining",
          "multiplier": 2
        },
        {
          "category": "travel",
          "multiplier": 2
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 90000,
            "minSpendCents": 1000000,
            "windowMonths": 3
          },
          {
            "amount": 40000,
            "minSpendCents": 4500000,
            "windowMonths": 12
          }
        ],
        "typicalPoints": 105000,
        "bestPoints": 180000,
        "eligibilityRule": "once_per_lifetime"
      },
      "perks": [
        {
          "id": "amex-plat-travel-credit",
          "kind": "credit",
          "label": "$200 annual travel credit",
          "amountCents": 20000,
          "cadence": "annual"
        },
        {
          "id": "amex-plat-dining-credit",
          "kind": "credit",
          "label": "$200 annual dining credit",
          "amountCents": 20000,
          "cadence": "annual"
        }
      ],
      "isActive": true
    },
    {
      "id": "amex-aeroplan",
      "issuer": "American Express",
      "name": "American Express Aeroplan Card",
      "network": "amex",
      "category": "travel",
      "currencyId": "aeroplan",
      "annualFeeCents": 12000,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "travel",
          "multiplier": 2
        },
        {
          "category": "dining",
          "multiplier": 1.5
        },
        {
          "category": "recurring",
          "multiplier": 1.5
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 35000,
            "minSpendCents": 750000,
            "windowMonths": 6
          }
        ],
        "typicalPoints": 45000,
        "bestPoints": 75000,
        "eligibilityRule": "once_per_lifetime"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "amex-aeroplan-reserve",
      "issuer": "American Express",
      "name": "American Express Aeroplan Reserve Card",
      "network": "amex",
      "category": "travel",
      "currencyId": "aeroplan",
      "annualFeeCents": 59900,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "excellent",
      "earnRules": [
        {
          "category": "travel",
          "multiplier": 3
        },
        {
          "category": "dining",
          "multiplier": 2
        },
        {
          "category": "recurring",
          "multiplier": 2
        },
        {
          "category": "everything_else",
          "multiplier": 1.25
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 70000,
            "minSpendCents": 750000,
            "windowMonths": 3
          },
          {
            "amount": 40000,
            "minSpendCents": 4500000,
            "windowMonths": 12
          }
        ],
        "typicalPoints": 85000,
        "bestPoints": 150000,
        "eligibilityRule": "once_per_lifetime"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "amex-marriott-bonvoy",
      "issuer": "American Express",
      "name": "Marriott Bonvoy American Express Card",
      "network": "amex",
      "category": "travel",
      "currencyId": "marriott",
      "annualFeeCents": 12000,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "travel",
          "multiplier": 5
        },
        {
          "category": "everything_else",
          "multiplier": 2
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 60000,
            "minSpendCents": 300000,
            "windowMonths": 3
          }
        ],
        "typicalPoints": 67000,
        "bestPoints": 110000,
        "eligibilityRule": "once_per_lifetime"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "amex-marriott-bonvoy-business",
      "issuer": "American Express",
      "name": "Marriott Bonvoy Business American Express Card",
      "network": "amex",
      "category": "business",
      "currencyId": "marriott",
      "annualFeeCents": 15000,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "travel",
          "multiplier": 5
        },
        {
          "category": "everything_else",
          "multiplier": 2
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 70000,
            "minSpendCents": 500000,
            "windowMonths": 3
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "amex-business-platinum",
      "issuer": "American Express",
      "name": "Business Platinum Card From American Express",
      "network": "amex",
      "category": "business",
      "currencyId": "mr",
      "annualFeeCents": 79900,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "excellent",
      "earnRules": [
        {
          "category": "everything_else",
          "multiplier": 1.25
        }
      ],
      "welcomeBonus": null,
      "perks": [],
      "isActive": true
    },
    {
      "id": "amex-business-gold",
      "issuer": "American Express",
      "name": "American Express Business Gold Rewards Card",
      "network": "amex",
      "category": "business",
      "currencyId": "mr",
      "annualFeeCents": 19900,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 50000,
            "minSpendCents": 750000,
            "windowMonths": 3
          },
          {
            "amount": 20000,
            "minSpendCents": 3000000,
            "windowMonths": 12
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "amex-simplycash",
      "issuer": "American Express",
      "name": "SimplyCash Card from American Express",
      "network": "amex",
      "category": "cashback",
      "currencyId": "cashback",
      "annualFeeCents": 0,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "gas",
          "multiplier": 2
        },
        {
          "category": "groceries",
          "multiplier": 2,
          "monthlyCapSpendCents": 1500000,
          "capPeriod": "annual",
          "capOverflowMultiplier": 1.25
        },
        {
          "category": "everything_else",
          "multiplier": 1.25
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 10000,
            "minSpendCents": 200000,
            "windowMonths": 3
          }
        ],
        "typicalPoints": 12500,
        "bestPoints": 50000,
        "eligibilityRule": "once_per_lifetime"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "amex-simplycash-preferred",
      "issuer": "American Express",
      "name": "SimplyCash Preferred Card from American Express",
      "network": "amex",
      "category": "cashback",
      "currencyId": "cashback",
      "annualFeeCents": 11988,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "gas",
          "multiplier": 4
        },
        {
          "category": "groceries",
          "multiplier": 4,
          "monthlyCapSpendCents": 3000000,
          "capPeriod": "annual",
          "capOverflowMultiplier": 2
        },
        {
          "category": "everything_else",
          "multiplier": 2
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 20000,
            "minSpendCents": 200000,
            "windowMonths": 3
          }
        ],
        "typicalPoints": 25000,
        "bestPoints": 50000,
        "eligibilityRule": "once_per_lifetime"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "amex-green",
      "issuer": "American Express",
      "name": "American Express Green Card",
      "network": "amex",
      "category": "rewards",
      "currencyId": "mr",
      "annualFeeCents": 0,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "fair",
      "earnRules": [
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 10000,
            "minSpendCents": 100000,
            "windowMonths": 3
          }
        ],
        "eligibilityRule": "once_per_lifetime"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "cibc-aeroplan-vi",
      "issuer": "CIBC",
      "name": "CIBC Aeroplan Visa Infinite",
      "network": "visa",
      "category": "travel",
      "currencyId": "aeroplan",
      "annualFeeCents": 13900,
      "feeWaivedFirstYear": true,
      "minIncomePersonalCents": 6000000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "groceries",
          "multiplier": 1.5
        },
        {
          "category": "gas",
          "multiplier": 1.5
        },
        {
          "category": "travel",
          "multiplier": 1.5
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 10000,
            "minSpendCents": 100,
            "windowMonths": 1
          },
          {
            "amount": 15000,
            "minSpendCents": 600000,
            "windowMonths": 6
          },
          {
            "amount": 25000,
            "minSpendCents": 1200000,
            "windowMonths": 12
          }
        ],
        "typicalPoints": 40000,
        "bestPoints": 50000,
        "eligibilityRule": "once_per_lifetime"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "cibc-aeroplan-vi-privilege",
      "issuer": "CIBC",
      "name": "CIBC Aeroplan Visa Infinite Privilege",
      "network": "visa",
      "category": "travel",
      "currencyId": "aeroplan",
      "annualFeeCents": 59900,
      "feeWaivedFirstYear": false,
      "minIncomePersonalCents": 15000000,
      "recommendedCreditScore": "excellent",
      "earnRules": [
        {
          "category": "groceries",
          "multiplier": 1.5
        },
        {
          "category": "gas",
          "multiplier": 1.5
        },
        {
          "category": "dining",
          "multiplier": 1.5
        },
        {
          "category": "transit",
          "multiplier": 1.5
        },
        {
          "category": "travel",
          "multiplier": 1.5
        },
        {
          "category": "everything_else",
          "multiplier": 1.25
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 10000,
            "minSpendCents": 100000,
            "windowMonths": 2
          },
          {
            "amount": 40000,
            "minSpendCents": 500000,
            "windowMonths": 4
          },
          {
            "amount": 50000,
            "minSpendCents": 2500000,
            "windowMonths": 12
          }
        ],
        "typicalPoints": 87000,
        "bestPoints": 100000,
        "eligibilityRule": "once_per_lifetime"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "cibc-aeroplan-business",
      "issuer": "CIBC",
      "name": "CIBC Aeroplan Visa Business",
      "network": "visa",
      "category": "business",
      "currencyId": "aeroplan",
      "annualFeeCents": 18000,
      "feeWaivedFirstYear": true,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "travel",
          "multiplier": 1.5
        },
        {
          "category": "dining",
          "multiplier": 1.5
        },
        {
          "category": "transit",
          "multiplier": 1.5
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 10000,
            "minSpendCents": 100,
            "windowMonths": 1
          },
          {
            "amount": 25000,
            "minSpendCents": 750000,
            "windowMonths": 3
          },
          {
            "amount": 40000,
            "minSpendCents": 4000000,
            "windowMonths": 12
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "cibc-aeroplan-business-plus",
      "issuer": "CIBC",
      "name": "CIBC Aeroplan Visa Business Plus",
      "network": "visa",
      "category": "business",
      "currencyId": "aeroplan",
      "annualFeeCents": 12000,
      "feeWaivedFirstYear": true,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "travel",
          "multiplier": 1.5
        },
        {
          "category": "dining",
          "multiplier": 1.5
        },
        {
          "category": "transit",
          "multiplier": 1.5
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 10000,
            "minSpendCents": 100,
            "windowMonths": 1
          },
          {
            "amount": 25000,
            "minSpendCents": 750000,
            "windowMonths": 3
          },
          {
            "amount": 40000,
            "minSpendCents": 4000000,
            "windowMonths": 12
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "cibc-aventura-vi",
      "issuer": "CIBC",
      "name": "CIBC Aventura Visa Infinite",
      "network": "visa",
      "category": "travel",
      "currencyId": "aventura",
      "annualFeeCents": 13900,
      "feeWaivedFirstYear": true,
      "minIncomePersonalCents": 6000000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "travel",
          "multiplier": 2
        },
        {
          "category": "groceries",
          "multiplier": 1.5
        },
        {
          "category": "gas",
          "multiplier": 1.5
        },
        {
          "category": "drugstore",
          "multiplier": 1.5
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 15000,
            "minSpendCents": 100,
            "windowMonths": 1
          },
          {
            "amount": 30000,
            "minSpendCents": 300000,
            "windowMonths": 4
          },
          {
            "amount": 15000,
            "minSpendCents": 500000,
            "windowMonths": 4
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "cibc-aventura-vi-privilege",
      "issuer": "CIBC",
      "name": "CIBC Aventura Visa Infinite Privilege",
      "network": "visa",
      "category": "travel",
      "currencyId": "aventura",
      "annualFeeCents": 49900,
      "feeWaivedFirstYear": false,
      "minIncomePersonalCents": 15000000,
      "recommendedCreditScore": "excellent",
      "earnRules": [
        {
          "category": "travel",
          "multiplier": 3
        },
        {
          "category": "dining",
          "multiplier": 2
        },
        {
          "category": "entertainment",
          "multiplier": 2
        },
        {
          "category": "transit",
          "multiplier": 2
        },
        {
          "category": "gas",
          "multiplier": 2
        },
        {
          "category": "groceries",
          "multiplier": 2
        },
        {
          "category": "everything_else",
          "multiplier": 1.25
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 25000,
            "minSpendCents": 300000,
            "windowMonths": 4
          },
          {
            "amount": 25000,
            "minSpendCents": 600000,
            "windowMonths": 4
          },
          {
            "amount": 30000,
            "minSpendCents": 2500000,
            "windowMonths": 12
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "cibc-aventura-gold",
      "issuer": "CIBC",
      "name": "CIBC Aventura Gold Visa",
      "network": "visa",
      "category": "travel",
      "currencyId": "aventura",
      "annualFeeCents": 13900,
      "feeWaivedFirstYear": true,
      "minIncomePersonalCents": 1500000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "travel",
          "multiplier": 2
        },
        {
          "category": "gas",
          "multiplier": 1.5
        },
        {
          "category": "groceries",
          "multiplier": 1.5
        },
        {
          "category": "drugstore",
          "multiplier": 1.5
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 15000,
            "minSpendCents": 100,
            "windowMonths": 1
          },
          {
            "amount": 30000,
            "minSpendCents": 300000,
            "windowMonths": 4
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "cibc-aventura-business",
      "issuer": "CIBC",
      "name": "CIBC Aventura Visa Card for Business",
      "network": "visa",
      "category": "business",
      "currencyId": "aventura",
      "annualFeeCents": 12000,
      "feeWaivedFirstYear": true,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "travel",
          "multiplier": 2
        },
        {
          "category": "gas",
          "multiplier": 1.5
        },
        {
          "category": "transit",
          "multiplier": 1.5
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 20000,
            "minSpendCents": 100,
            "windowMonths": 1
          },
          {
            "amount": 50000,
            "minSpendCents": 4000000,
            "windowMonths": 12
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "cibc-dividend-vi",
      "issuer": "CIBC",
      "name": "CIBC Dividend Visa Infinite",
      "network": "visa",
      "category": "cashback",
      "currencyId": "cashback",
      "annualFeeCents": 12000,
      "feeWaivedFirstYear": true,
      "minIncomePersonalCents": 6000000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "groceries",
          "multiplier": 4,
          "monthlyCapSpendCents": 8000000,
          "capPeriod": "annual",
          "capOverflowMultiplier": 1
        },
        {
          "category": "gas",
          "multiplier": 4,
          "monthlyCapSpendCents": 8000000,
          "capPeriod": "annual",
          "capOverflowMultiplier": 1
        },
        {
          "category": "dining",
          "multiplier": 2
        },
        {
          "category": "transit",
          "multiplier": 2
        },
        {
          "category": "recurring",
          "multiplier": 2
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 20000,
            "minSpendCents": 200000,
            "windowMonths": 4
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "cibc-dividend-platinum",
      "issuer": "CIBC",
      "name": "CIBC Dividend Platinum Visa",
      "network": "visa",
      "category": "cashback",
      "currencyId": "cashback",
      "annualFeeCents": 9900,
      "feeWaivedFirstYear": true,
      "minIncomePersonalCents": 1500000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "groceries",
          "multiplier": 3
        },
        {
          "category": "gas",
          "multiplier": 3
        },
        {
          "category": "dining",
          "multiplier": 2
        },
        {
          "category": "transit",
          "multiplier": 2
        },
        {
          "category": "recurring",
          "multiplier": 2
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 20000,
            "minSpendCents": 200000,
            "windowMonths": 4
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "cibc-costco",
      "issuer": "CIBC",
      "name": "CIBC Costco Mastercard",
      "network": "mastercard",
      "category": "cashback",
      "currencyId": "cashback",
      "annualFeeCents": 0,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "fair",
      "earnRules": [
        {
          "category": "dining",
          "multiplier": 3
        },
        {
          "category": "gas",
          "multiplier": 2
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": null,
      "perks": [],
      "isActive": true
    },
    {
      "id": "rbc-avion-vi",
      "issuer": "RBC",
      "name": "RBC Avion Visa Infinite",
      "network": "visa",
      "category": "travel",
      "currencyId": "avion",
      "annualFeeCents": 12000,
      "feeWaivedFirstYear": false,
      "minIncomePersonalCents": 6000000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "travel",
          "multiplier": 1.25
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 35000,
            "minSpendCents": 100,
            "windowMonths": 1
          },
          {
            "amount": 20000,
            "minSpendCents": 500000,
            "windowMonths": 6
          }
        ],
        "typicalPoints": 45000,
        "bestPoints": 70000,
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "rbc-avion-vi-privilege",
      "issuer": "RBC",
      "name": "RBC Avion Visa Infinite Privilege",
      "network": "visa",
      "category": "travel",
      "currencyId": "avion",
      "annualFeeCents": 39900,
      "feeWaivedFirstYear": false,
      "minIncomePersonalCents": 20000000,
      "recommendedCreditScore": "excellent",
      "earnRules": [
        {
          "category": "everything_else",
          "multiplier": 1.25
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 35000,
            "minSpendCents": 100,
            "windowMonths": 1
          },
          {
            "amount": 20000,
            "minSpendCents": 500000,
            "windowMonths": 6
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "rbc-avion-platinum",
      "issuer": "RBC",
      "name": "RBC Avion Visa Platinum",
      "network": "visa",
      "category": "travel",
      "currencyId": "avion",
      "annualFeeCents": 12000,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 35000,
            "minSpendCents": 100,
            "windowMonths": 1
          },
          {
            "amount": 20000,
            "minSpendCents": 500000,
            "windowMonths": 6
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "rbc-british-airways-vi",
      "issuer": "RBC",
      "name": "RBC British Airways Visa Infinite",
      "network": "visa",
      "category": "travel",
      "currencyId": "avios",
      "annualFeeCents": 16500,
      "feeWaivedFirstYear": false,
      "minIncomePersonalCents": 6000000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "travel",
          "multiplier": 3
        },
        {
          "category": "dining",
          "multiplier": 2
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 30000,
            "minSpendCents": 500000,
            "windowMonths": 3
          },
          {
            "amount": 30000,
            "minSpendCents": 1000000,
            "windowMonths": 6
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "rbc-cashback-preferred-we",
      "issuer": "RBC",
      "name": "RBC Cash Back Preferred World Elite Mastercard",
      "network": "mastercard",
      "category": "cashback",
      "currencyId": "cashback",
      "annualFeeCents": 9900,
      "feeWaivedFirstYear": false,
      "minIncomePersonalCents": 8000000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "everything_else",
          "multiplier": 1.5,
          "monthlyCapSpendCents": 2500000,
          "capPeriod": "annual",
          "capOverflowMultiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 24000,
            "minSpendCents": 200000,
            "windowMonths": 3
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "rbc-ion-plus",
      "issuer": "RBC",
      "name": "RBC ION+ Visa",
      "network": "visa",
      "category": "rewards",
      "currencyId": "avion",
      "annualFeeCents": 4800,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "groceries",
          "multiplier": 3
        },
        {
          "category": "dining",
          "multiplier": 3
        },
        {
          "category": "gas",
          "multiplier": 3
        },
        {
          "category": "transit",
          "multiplier": 3
        },
        {
          "category": "entertainment",
          "multiplier": 3
        },
        {
          "category": "recurring",
          "multiplier": 3
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 7000,
            "minSpendCents": 100,
            "windowMonths": 1
          },
          {
            "amount": 14000,
            "minSpendCents": 150000,
            "windowMonths": 6
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "rbc-ion",
      "issuer": "RBC",
      "name": "RBC ION Visa",
      "network": "visa",
      "category": "rewards",
      "currencyId": "avion",
      "annualFeeCents": 0,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "fair",
      "earnRules": [
        {
          "category": "groceries",
          "multiplier": 1.5
        },
        {
          "category": "gas",
          "multiplier": 1.5
        },
        {
          "category": "transit",
          "multiplier": 1.5
        },
        {
          "category": "entertainment",
          "multiplier": 1.5
        },
        {
          "category": "recurring",
          "multiplier": 1.5
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 7000,
            "minSpendCents": 100,
            "windowMonths": 1
          },
          {
            "amount": 7000,
            "minSpendCents": 50000,
            "windowMonths": 3
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "rbc-westjet-we",
      "issuer": "RBC",
      "name": "WestJet RBC World Elite Mastercard",
      "network": "mastercard",
      "category": "travel",
      "currencyId": "westjet",
      "annualFeeCents": 13900,
      "feeWaivedFirstYear": false,
      "minIncomePersonalCents": 8000000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "travel",
          "multiplier": 2
        },
        {
          "category": "groceries",
          "multiplier": 2
        },
        {
          "category": "gas",
          "multiplier": 2
        },
        {
          "category": "transit",
          "multiplier": 2
        },
        {
          "category": "everything_else",
          "multiplier": 1.5
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 30000,
            "minSpendCents": 100,
            "windowMonths": 1
          },
          {
            "amount": 30000,
            "minSpendCents": 500000,
            "windowMonths": 3
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "rbc-westjet-mc",
      "issuer": "RBC",
      "name": "WestJet RBC Mastercard",
      "network": "mastercard",
      "category": "travel",
      "currencyId": "westjet",
      "annualFeeCents": 3900,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "travel",
          "multiplier": 1.5
        },
        {
          "category": "dining",
          "multiplier": 1.5
        },
        {
          "category": "recurring",
          "multiplier": 1.5
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 5000,
            "minSpendCents": 100,
            "windowMonths": 1
          },
          {
            "amount": 10000,
            "minSpendCents": 100000,
            "windowMonths": 3
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "rbc-cashback-mc",
      "issuer": "RBC",
      "name": "RBC Cash Back Mastercard",
      "network": "mastercard",
      "category": "cashback",
      "currencyId": "cashback",
      "annualFeeCents": 0,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "fair",
      "earnRules": [
        {
          "category": "groceries",
          "multiplier": 2,
          "monthlyCapSpendCents": 600000,
          "capPeriod": "annual",
          "capOverflowMultiplier": 1
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 7000,
            "minSpendCents": 100000,
            "windowMonths": 3
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "bmo-cashback-we",
      "issuer": "BMO",
      "name": "BMO CashBack World Elite Mastercard",
      "network": "mastercard",
      "category": "cashback",
      "currencyId": "cashback",
      "annualFeeCents": 13900,
      "feeWaivedFirstYear": true,
      "minIncomePersonalCents": 8000000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "groceries",
          "multiplier": 5,
          "monthlyCapSpendCents": 50000,
          "capPeriod": "monthly",
          "capOverflowMultiplier": 1
        },
        {
          "category": "transit",
          "multiplier": 4,
          "monthlyCapSpendCents": 30000,
          "capPeriod": "monthly",
          "capOverflowMultiplier": 1
        },
        {
          "category": "gas",
          "multiplier": 3,
          "monthlyCapSpendCents": 30000,
          "capPeriod": "monthly",
          "capOverflowMultiplier": 1
        },
        {
          "category": "recurring",
          "multiplier": 2,
          "monthlyCapSpendCents": 50000,
          "capPeriod": "monthly",
          "capOverflowMultiplier": 1
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 12000,
            "minSpendCents": 600000,
            "windowMonths": 3
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "bmo-cashback-mc",
      "issuer": "BMO",
      "name": "BMO CashBack Mastercard",
      "network": "mastercard",
      "category": "cashback",
      "currencyId": "cashback",
      "annualFeeCents": 0,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "fair",
      "earnRules": [
        {
          "category": "groceries",
          "multiplier": 3,
          "monthlyCapSpendCents": 50000,
          "capPeriod": "monthly",
          "capOverflowMultiplier": 0.5
        },
        {
          "category": "recurring",
          "multiplier": 1
        },
        {
          "category": "everything_else",
          "multiplier": 0.5
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 12500,
            "minSpendCents": 250000,
            "windowMonths": 3
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "bmo-eclipse-vi",
      "issuer": "BMO",
      "name": "BMO eclipse Visa Infinite",
      "network": "visa",
      "category": "rewards",
      "currencyId": "bmo",
      "annualFeeCents": 12000,
      "feeWaivedFirstYear": true,
      "minIncomePersonalCents": 6000000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "dining",
          "multiplier": 5
        },
        {
          "category": "groceries",
          "multiplier": 5
        },
        {
          "category": "gas",
          "multiplier": 5
        },
        {
          "category": "transit",
          "multiplier": 5
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 70000,
            "minSpendCents": 300000,
            "windowMonths": 3
          }
        ],
        "typicalPoints": 60000,
        "bestPoints": 80000,
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "bmo-eclipse-vi-privilege",
      "issuer": "BMO",
      "name": "BMO eclipse Visa Infinite Privilege",
      "network": "visa",
      "category": "rewards",
      "currencyId": "bmo",
      "annualFeeCents": 59900,
      "feeWaivedFirstYear": false,
      "minIncomePersonalCents": 15000000,
      "recommendedCreditScore": "excellent",
      "earnRules": [
        {
          "category": "travel",
          "multiplier": 5
        },
        {
          "category": "dining",
          "multiplier": 5
        },
        {
          "category": "groceries",
          "multiplier": 5
        },
        {
          "category": "gas",
          "multiplier": 5
        },
        {
          "category": "drugstore",
          "multiplier": 5
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 80000,
            "minSpendCents": 600000,
            "windowMonths": 3
          },
          {
            "amount": 40000,
            "minSpendCents": 3000000,
            "windowMonths": 6
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "bmo-eclipse-rise",
      "issuer": "BMO",
      "name": "BMO eclipse rise Visa",
      "network": "visa",
      "category": "rewards",
      "currencyId": "bmo",
      "annualFeeCents": 0,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "fair",
      "earnRules": [
        {
          "category": "recurring",
          "multiplier": 2.5
        },
        {
          "category": "groceries",
          "multiplier": 2.5
        },
        {
          "category": "dining",
          "multiplier": 2.5
        },
        {
          "category": "everything_else",
          "multiplier": 0.5
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 25000,
            "minSpendCents": 150000,
            "windowMonths": 3
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "bmo-ascend-we",
      "issuer": "BMO",
      "name": "BMO Ascend World Elite Mastercard",
      "network": "mastercard",
      "category": "travel",
      "currencyId": "bmo",
      "annualFeeCents": 15000,
      "feeWaivedFirstYear": true,
      "minIncomePersonalCents": 8000000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "travel",
          "multiplier": 5
        },
        {
          "category": "dining",
          "multiplier": 3
        },
        {
          "category": "entertainment",
          "multiplier": 3
        },
        {
          "category": "recurring",
          "multiplier": 3
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 45000,
            "minSpendCents": 500000,
            "windowMonths": 3
          },
          {
            "amount": 20000,
            "minSpendCents": 1000000,
            "windowMonths": 6
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "bmo-viporter",
      "issuer": "BMO",
      "name": "BMO VIPorter Mastercard",
      "network": "mastercard",
      "category": "travel",
      "currencyId": "porter",
      "annualFeeCents": 8900,
      "feeWaivedFirstYear": true,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "travel",
          "multiplier": 2
        },
        {
          "category": "groceries",
          "multiplier": 1
        },
        {
          "category": "dining",
          "multiplier": 1
        },
        {
          "category": "everything_else",
          "multiplier": 0.5
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 40000,
            "minSpendCents": 1000000,
            "windowMonths": 12
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "bmo-viporter-we",
      "issuer": "BMO",
      "name": "BMO VIPorter World Elite Mastercard",
      "network": "mastercard",
      "category": "travel",
      "currencyId": "porter",
      "annualFeeCents": 19900,
      "feeWaivedFirstYear": true,
      "minIncomePersonalCents": 8000000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "travel",
          "multiplier": 3
        },
        {
          "category": "groceries",
          "multiplier": 2
        },
        {
          "category": "dining",
          "multiplier": 2
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 20000,
            "minSpendCents": 500000,
            "windowMonths": 4
          },
          {
            "amount": 50000,
            "minSpendCents": 1800000,
            "windowMonths": 12
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "bmo-ascend-business",
      "issuer": "BMO",
      "name": "BMO Ascend World Elite Business Mastercard",
      "network": "mastercard",
      "category": "business",
      "currencyId": "bmo",
      "annualFeeCents": 14900,
      "feeWaivedFirstYear": true,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "gas",
          "multiplier": 4
        },
        {
          "category": "entertainment",
          "multiplier": 4
        },
        {
          "category": "recurring",
          "multiplier": 4
        },
        {
          "category": "everything_else",
          "multiplier": 1.5
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 20000,
            "minSpendCents": 100,
            "windowMonths": 3
          },
          {
            "amount": 40000,
            "minSpendCents": 3600000,
            "windowMonths": 12
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "scotia-gold-amex",
      "issuer": "Scotiabank",
      "name": "Scotiabank Gold American Express",
      "network": "amex",
      "category": "travel",
      "currencyId": "sceneplus",
      "annualFeeCents": 12000,
      "feeWaivedFirstYear": false,
      "fxFeePct": 0,
      "minIncomePersonalCents": 1200000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "groceries",
          "multiplier": 6
        },
        {
          "category": "dining",
          "multiplier": 5
        },
        {
          "category": "entertainment",
          "multiplier": 5
        },
        {
          "category": "gas",
          "multiplier": 3
        },
        {
          "category": "transit",
          "multiplier": 3
        },
        {
          "category": "recurring",
          "multiplier": 3
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 30000,
            "minSpendCents": 200000,
            "windowMonths": 3
          },
          {
            "amount": 20000,
            "minSpendCents": 750000,
            "windowMonths": 12
          }
        ],
        "typicalPoints": 40000,
        "bestPoints": 50000,
        "eligibilityRule": "no_bonus_if_held_in_months",
        "heldWithinMonths": 24
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "scotia-passport",
      "issuer": "Scotiabank",
      "name": "Scotiabank Passport Visa Infinite +",
      "network": "visa",
      "category": "travel",
      "currencyId": "sceneplus",
      "annualFeeCents": 15000,
      "feeWaivedFirstYear": false,
      "fxFeePct": 0,
      "minIncomePersonalCents": 6000000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "groceries",
          "multiplier": 3
        },
        {
          "category": "dining",
          "multiplier": 2
        },
        {
          "category": "entertainment",
          "multiplier": 2
        },
        {
          "category": "transit",
          "multiplier": 2
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 40000,
            "minSpendCents": 200000,
            "windowMonths": 3
          },
          {
            "amount": 10000,
            "minSpendCents": 1000000,
            "windowMonths": 6
          }
        ],
        "typicalPoints": 35000,
        "bestPoints": 50000,
        "eligibilityRule": "no_bonus_if_held_in_months",
        "heldWithinMonths": 24
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "scotia-passport-privilege",
      "issuer": "Scotiabank",
      "name": "Scotiabank Passport Visa Infinite Privilege",
      "network": "visa",
      "category": "travel",
      "currencyId": "sceneplus",
      "annualFeeCents": 59900,
      "feeWaivedFirstYear": false,
      "fxFeePct": 0,
      "recommendedCreditScore": "excellent",
      "earnRules": [
        {
          "category": "travel",
          "multiplier": 3
        },
        {
          "category": "dining",
          "multiplier": 2
        },
        {
          "category": "entertainment",
          "multiplier": 2
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 30000,
            "minSpendCents": 300000,
            "windowMonths": 3
          },
          {
            "amount": 30000,
            "minSpendCents": 2000000,
            "windowMonths": 6
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "scotia-momentum-vi",
      "issuer": "Scotiabank",
      "name": "Scotia Momentum Visa Infinite +",
      "network": "visa",
      "category": "cashback",
      "currencyId": "cashback",
      "annualFeeCents": 12000,
      "feeWaivedFirstYear": true,
      "minIncomePersonalCents": 6000000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "groceries",
          "multiplier": 4,
          "monthlyCapSpendCents": 2500000,
          "capPeriod": "annual",
          "capOverflowMultiplier": 1
        },
        {
          "category": "recurring",
          "multiplier": 4,
          "monthlyCapSpendCents": 2500000,
          "capPeriod": "annual",
          "capOverflowMultiplier": 1
        },
        {
          "category": "gas",
          "multiplier": 2
        },
        {
          "category": "transit",
          "multiplier": 2
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 30000,
            "minSpendCents": 200000,
            "windowMonths": 3
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "scotia-momentum-nofee",
      "issuer": "Scotiabank",
      "name": "Scotia Momentum No-Fee Visa",
      "network": "visa",
      "category": "cashback",
      "currencyId": "cashback",
      "annualFeeCents": 0,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "fair",
      "earnRules": [
        {
          "category": "groceries",
          "multiplier": 1
        },
        {
          "category": "gas",
          "multiplier": 1
        },
        {
          "category": "drugstore",
          "multiplier": 1
        },
        {
          "category": "recurring",
          "multiplier": 1
        },
        {
          "category": "everything_else",
          "multiplier": 0.5
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 10000,
            "minSpendCents": 200000,
            "windowMonths": 3
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "scotia-scene-visa",
      "issuer": "Scotiabank",
      "name": "Scotiabank Scene+ Visa",
      "network": "visa",
      "category": "rewards",
      "currencyId": "sceneplus",
      "annualFeeCents": 0,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "fair",
      "earnRules": [
        {
          "category": "groceries",
          "multiplier": 2
        },
        {
          "category": "entertainment",
          "multiplier": 2
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 2500,
            "minSpendCents": 25000,
            "windowMonths": 3
          },
          {
            "amount": 2500,
            "minSpendCents": 100000,
            "windowMonths": 3
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "scotia-amex-nofee",
      "issuer": "Scotiabank",
      "name": "Scotiabank American Express Card",
      "network": "amex",
      "category": "rewards",
      "currencyId": "sceneplus",
      "annualFeeCents": 0,
      "feeWaivedFirstYear": false,
      "fxFeePct": 2.5,
      "recommendedCreditScore": "fair",
      "earnRules": [
        {
          "category": "groceries",
          "multiplier": 3
        },
        {
          "category": "dining",
          "multiplier": 2
        },
        {
          "category": "gas",
          "multiplier": 2
        },
        {
          "category": "transit",
          "multiplier": 2
        },
        {
          "category": "recurring",
          "multiplier": 2
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 2500,
            "minSpendCents": 25000,
            "windowMonths": 3
          },
          {
            "amount": 7500,
            "minSpendCents": 100000,
            "windowMonths": 3
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "scotia-platinum-amex",
      "issuer": "Scotiabank",
      "name": "Scotiabank Platinum American Express",
      "network": "amex",
      "category": "travel",
      "currencyId": "sceneplus",
      "annualFeeCents": 39900,
      "feeWaivedFirstYear": false,
      "fxFeePct": 0,
      "minIncomePersonalCents": 1200000,
      "recommendedCreditScore": "excellent",
      "earnRules": [
        {
          "category": "travel",
          "multiplier": 2
        },
        {
          "category": "everything_else",
          "multiplier": 2
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 60000,
            "minSpendCents": 500000,
            "windowMonths": 3
          },
          {
            "amount": 20000,
            "minSpendCents": 1000000,
            "windowMonths": 6
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "td-aeroplan-vi",
      "issuer": "TD",
      "name": "TD Aeroplan Visa Infinite",
      "network": "visa",
      "category": "travel",
      "currencyId": "aeroplan",
      "annualFeeCents": 13900,
      "feeWaivedFirstYear": true,
      "minIncomePersonalCents": 6000000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "groceries",
          "multiplier": 1.5
        },
        {
          "category": "gas",
          "multiplier": 1.5
        },
        {
          "category": "travel",
          "multiplier": 1.5
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 10000,
            "minSpendCents": 100,
            "windowMonths": 1
          },
          {
            "amount": 15000,
            "minSpendCents": 300000,
            "windowMonths": 3
          },
          {
            "amount": 15000,
            "minSpendCents": 1200000,
            "windowMonths": 12
          }
        ],
        "typicalPoints": 40000,
        "bestPoints": 50000,
        "eligibilityRule": "once_per_lifetime"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "td-aeroplan-vi-privilege",
      "issuer": "TD",
      "name": "TD Aeroplan Visa Infinite Privilege",
      "network": "visa",
      "category": "travel",
      "currencyId": "aeroplan",
      "annualFeeCents": 59900,
      "feeWaivedFirstYear": false,
      "minIncomePersonalCents": 15000000,
      "recommendedCreditScore": "excellent",
      "earnRules": [
        {
          "category": "travel",
          "multiplier": 1.5
        },
        {
          "category": "groceries",
          "multiplier": 1.5
        },
        {
          "category": "gas",
          "multiplier": 1.5
        },
        {
          "category": "transit",
          "multiplier": 1.5
        },
        {
          "category": "dining",
          "multiplier": 1.5
        },
        {
          "category": "everything_else",
          "multiplier": 1.25
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 20000,
            "minSpendCents": 100,
            "windowMonths": 1
          },
          {
            "amount": 35000,
            "minSpendCents": 1200000,
            "windowMonths": 6
          },
          {
            "amount": 30000,
            "minSpendCents": 2400000,
            "windowMonths": 12
          }
        ],
        "typicalPoints": 75000,
        "bestPoints": 85000,
        "eligibilityRule": "once_per_lifetime"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "td-cashback-vi",
      "issuer": "TD",
      "name": "TD Cash Back Visa Infinite",
      "network": "visa",
      "category": "cashback",
      "currencyId": "cashback",
      "annualFeeCents": 13900,
      "feeWaivedFirstYear": true,
      "minIncomePersonalCents": 6000000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "groceries",
          "multiplier": 3,
          "monthlyCapSpendCents": 1500000,
          "capPeriod": "annual",
          "capOverflowMultiplier": 1
        },
        {
          "category": "gas",
          "multiplier": 3,
          "monthlyCapSpendCents": 1500000,
          "capPeriod": "annual",
          "capOverflowMultiplier": 1
        },
        {
          "category": "transit",
          "multiplier": 3,
          "monthlyCapSpendCents": 1500000,
          "capPeriod": "annual",
          "capOverflowMultiplier": 1
        },
        {
          "category": "recurring",
          "multiplier": 3,
          "monthlyCapSpendCents": 1500000,
          "capPeriod": "annual",
          "capOverflowMultiplier": 1
        },
        {
          "category": "entertainment",
          "multiplier": 3,
          "monthlyCapSpendCents": 1500000,
          "capPeriod": "annual",
          "capOverflowMultiplier": 1
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 35000,
            "minSpendCents": 350000,
            "windowMonths": 3
          }
        ],
        "typicalPoints": 30000,
        "bestPoints": 35000,
        "eligibilityRule": "no_bonus_if_held_in_months",
        "heldWithinMonths": 12
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "td-first-class-travel-vi",
      "issuer": "TD",
      "name": "TD First Class Travel Visa Infinite",
      "network": "visa",
      "category": "travel",
      "currencyId": "tdrewards",
      "annualFeeCents": 13900,
      "feeWaivedFirstYear": true,
      "minIncomePersonalCents": 6000000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "travel",
          "multiplier": 8
        },
        {
          "category": "groceries",
          "multiplier": 6,
          "monthlyCapSpendCents": 2500000,
          "capPeriod": "annual",
          "capOverflowMultiplier": 2
        },
        {
          "category": "dining",
          "multiplier": 6
        },
        {
          "category": "transit",
          "multiplier": 6
        },
        {
          "category": "recurring",
          "multiplier": 4
        },
        {
          "category": "entertainment",
          "multiplier": 4
        },
        {
          "category": "everything_else",
          "multiplier": 2
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 20000,
            "minSpendCents": 100,
            "windowMonths": 1
          },
          {
            "amount": 126000,
            "minSpendCents": 750000,
            "windowMonths": 6
          }
        ],
        "typicalPoints": 130000,
        "bestPoints": 165000,
        "eligibilityRule": "no_bonus_if_held_in_months",
        "heldWithinMonths": 12
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "td-rewards-visa",
      "issuer": "TD",
      "name": "TD Rewards Visa",
      "network": "visa",
      "category": "rewards",
      "currencyId": "tdrewards",
      "annualFeeCents": 0,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "fair",
      "earnRules": [
        {
          "category": "travel",
          "multiplier": 4
        },
        {
          "category": "groceries",
          "multiplier": 3,
          "monthlyCapSpendCents": 500000,
          "capPeriod": "annual",
          "capOverflowMultiplier": 1
        },
        {
          "category": "dining",
          "multiplier": 3,
          "monthlyCapSpendCents": 500000,
          "capPeriod": "annual",
          "capOverflowMultiplier": 1
        },
        {
          "category": "transit",
          "multiplier": 3,
          "monthlyCapSpendCents": 500000,
          "capPeriod": "annual",
          "capOverflowMultiplier": 1
        },
        {
          "category": "recurring",
          "multiplier": 2
        },
        {
          "category": "entertainment",
          "multiplier": 2
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 30310,
            "minSpendCents": 150000,
            "windowMonths": 3
          }
        ],
        "eligibilityRule": "no_bonus_if_held_in_months",
        "heldWithinMonths": 12
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "td-platinum-travel-visa",
      "issuer": "TD",
      "name": "TD Platinum Travel Visa",
      "network": "visa",
      "category": "travel",
      "currencyId": "tdrewards",
      "annualFeeCents": 8900,
      "feeWaivedFirstYear": true,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "travel",
          "multiplier": 6
        },
        {
          "category": "groceries",
          "multiplier": 4.5,
          "monthlyCapSpendCents": 1500000,
          "capPeriod": "annual",
          "capOverflowMultiplier": 1.5
        },
        {
          "category": "dining",
          "multiplier": 4.5,
          "monthlyCapSpendCents": 1500000,
          "capPeriod": "annual",
          "capOverflowMultiplier": 1.5
        },
        {
          "category": "transit",
          "multiplier": 4.5,
          "monthlyCapSpendCents": 1500000,
          "capPeriod": "annual",
          "capOverflowMultiplier": 1.5
        },
        {
          "category": "recurring",
          "multiplier": 3
        },
        {
          "category": "entertainment",
          "multiplier": 3
        },
        {
          "category": "everything_else",
          "multiplier": 1.5
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 15000,
            "minSpendCents": 100,
            "windowMonths": 1
          },
          {
            "amount": 35000,
            "minSpendCents": 300000,
            "windowMonths": 6
          }
        ],
        "eligibilityRule": "no_bonus_if_held_in_months",
        "heldWithinMonths": 12
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "neo-cathay-we",
      "issuer": "Neo Financial",
      "name": "Cathay World Elite Mastercard (Neo)",
      "network": "mastercard",
      "category": "travel",
      "currencyId": "asia",
      "annualFeeCents": 18000,
      "feeWaivedFirstYear": false,
      "minIncomePersonalCents": 8000000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "travel",
          "multiplier": 2
        },
        {
          "category": "foreign",
          "multiplier": 2
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 35000,
            "minSpendCents": 100,
            "windowMonths": 1
          },
          {
            "amount": 25000,
            "minSpendCents": 500000,
            "windowMonths": 3
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "neo-we-cashback",
      "issuer": "Neo Financial",
      "name": "Neo World Elite Mastercard",
      "network": "mastercard",
      "category": "cashback",
      "currencyId": "cashback",
      "annualFeeCents": 14900,
      "feeWaivedFirstYear": false,
      "minIncomePersonalCents": 8000000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "groceries",
          "multiplier": 5,
          "monthlyCapSpendCents": 100000,
          "capPeriod": "monthly",
          "capOverflowMultiplier": 1
        },
        {
          "category": "recurring",
          "multiplier": 4,
          "monthlyCapSpendCents": 50000,
          "capPeriod": "monthly",
          "capOverflowMultiplier": 1
        },
        {
          "category": "gas",
          "multiplier": 3,
          "monthlyCapSpendCents": 100000,
          "capPeriod": "monthly",
          "capOverflowMultiplier": 1
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": null,
      "perks": [],
      "isActive": true
    },
    {
      "id": "tangerine-moneyback",
      "issuer": "Tangerine",
      "name": "Tangerine Money-Back Credit Card",
      "network": "mastercard",
      "category": "cashback",
      "currencyId": "cashback",
      "annualFeeCents": 0,
      "feeWaivedFirstYear": false,
      "minIncomePersonalCents": 1200000,
      "recommendedCreditScore": "fair",
      "earnRules": [
        {
          "category": "groceries",
          "multiplier": 2
        },
        {
          "category": "gas",
          "multiplier": 2
        },
        {
          "category": "recurring",
          "multiplier": 2
        },
        {
          "category": "everything_else",
          "multiplier": 0.5
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 10000,
            "minSpendCents": 100000,
            "windowMonths": 2
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "tangerine-moneyback-world",
      "issuer": "Tangerine",
      "name": "Tangerine Money-Back World Mastercard",
      "network": "mastercard",
      "category": "cashback",
      "currencyId": "cashback",
      "annualFeeCents": 0,
      "feeWaivedFirstYear": false,
      "minIncomePersonalCents": 5000000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "groceries",
          "multiplier": 2
        },
        {
          "category": "gas",
          "multiplier": 2
        },
        {
          "category": "recurring",
          "multiplier": 2
        },
        {
          "category": "everything_else",
          "multiplier": 0.5
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 10000,
            "minSpendCents": 150000,
            "windowMonths": 3
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "simplii-cashback-visa",
      "issuer": "Simplii Financial",
      "name": "Simplii Financial Cash Back Visa",
      "network": "visa",
      "category": "cashback",
      "currencyId": "cashback",
      "annualFeeCents": 0,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "fair",
      "earnRules": [
        {
          "category": "dining",
          "multiplier": 4,
          "monthlyCapSpendCents": 500000,
          "capPeriod": "annual",
          "capOverflowMultiplier": 0.5
        },
        {
          "category": "gas",
          "multiplier": 1.5
        },
        {
          "category": "groceries",
          "multiplier": 1.5
        },
        {
          "category": "drugstore",
          "multiplier": 1.5
        },
        {
          "category": "recurring",
          "multiplier": 1.5
        },
        {
          "category": "everything_else",
          "multiplier": 0.5
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 10000,
            "minSpendCents": 50000,
            "windowMonths": 3
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "nbc-we-mc",
      "issuer": "National Bank",
      "name": "National Bank World Elite Mastercard",
      "network": "mastercard",
      "category": "rewards",
      "currencyId": "nbrewards",
      "annualFeeCents": 15000,
      "feeWaivedFirstYear": false,
      "minIncomePersonalCents": 8000000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "groceries",
          "multiplier": 5,
          "monthlyCapSpendCents": 250000,
          "capPeriod": "monthly",
          "capOverflowMultiplier": 2
        },
        {
          "category": "dining",
          "multiplier": 5,
          "monthlyCapSpendCents": 250000,
          "capPeriod": "monthly",
          "capOverflowMultiplier": 2
        },
        {
          "category": "gas",
          "multiplier": 2
        },
        {
          "category": "transit",
          "multiplier": 2
        },
        {
          "category": "recurring",
          "multiplier": 2
        },
        {
          "category": "travel",
          "multiplier": 2
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": null,
      "perks": [],
      "isActive": true
    },
    {
      "id": "nbc-echo-cashback",
      "issuer": "National Bank",
      "name": "National Bank ECHO Cashback Mastercard",
      "network": "mastercard",
      "category": "cashback",
      "currencyId": "cashback",
      "annualFeeCents": 3000,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "groceries",
          "multiplier": 1.5
        },
        {
          "category": "gas",
          "multiplier": 1.5
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": null,
      "perks": [],
      "isActive": true
    },
    {
      "id": "pc-insiders-we",
      "issuer": "PC Financial",
      "name": "PC Insiders World Elite Mastercard",
      "network": "mastercard",
      "category": "rewards",
      "currencyId": "pcoptimum",
      "annualFeeCents": 12000,
      "feeWaivedFirstYear": true,
      "minIncomePersonalCents": 8000000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "drugstore",
          "multiplier": 50
        },
        {
          "category": "groceries",
          "multiplier": 40
        },
        {
          "category": "everything_else",
          "multiplier": 10
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 300000,
            "minSpendCents": 300000,
            "windowMonths": 4
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "pc-money-mc",
      "issuer": "PC Financial",
      "name": "PC Money Mastercard",
      "network": "mastercard",
      "category": "rewards",
      "currencyId": "pcoptimum",
      "annualFeeCents": 0,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "fair",
      "earnRules": [
        {
          "category": "drugstore",
          "multiplier": 25
        },
        {
          "category": "groceries",
          "multiplier": 10
        },
        {
          "category": "everything_else",
          "multiplier": 5
        }
      ],
      "welcomeBonus": null,
      "perks": [],
      "isActive": true
    },
    {
      "id": "rogers-red-we",
      "issuer": "Rogers Bank",
      "name": "Rogers Red World Elite Mastercard",
      "network": "mastercard",
      "category": "cashback",
      "currencyId": "cashback",
      "annualFeeCents": 0,
      "feeWaivedFirstYear": false,
      "minIncomePersonalCents": 8000000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "foreign",
          "multiplier": 3
        },
        {
          "category": "everything_else",
          "multiplier": 1.5
        }
      ],
      "welcomeBonus": null,
      "perks": [],
      "isActive": true
    },
    {
      "id": "brim-we",
      "issuer": "Brim Financial",
      "name": "Brim World Elite Mastercard",
      "network": "mastercard",
      "category": "cashback",
      "currencyId": "cashback",
      "annualFeeCents": 8900,
      "feeWaivedFirstYear": false,
      "minIncomePersonalCents": 8000000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": null,
      "perks": [],
      "isActive": true
    },
    {
      "id": "triangle-we",
      "issuer": "Canadian Tire",
      "name": "Triangle World Elite Mastercard",
      "network": "mastercard",
      "category": "store",
      "currencyId": "cashback",
      "annualFeeCents": 0,
      "feeWaivedFirstYear": false,
      "minIncomePersonalCents": 8000000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "groceries",
          "multiplier": 3,
          "monthlyCapSpendCents": 1200000,
          "capPeriod": "annual",
          "capOverflowMultiplier": 1
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": null,
      "perks": [],
      "isActive": true
    },
    {
      "id": "walmart-rewards-mc",
      "issuer": "Walmart",
      "name": "Walmart Rewards Mastercard",
      "network": "mastercard",
      "category": "store",
      "currencyId": "cashback",
      "annualFeeCents": 0,
      "feeWaivedFirstYear": false,
      "recommendedCreditScore": "fair",
      "earnRules": [
        {
          "category": "groceries",
          "multiplier": 3
        },
        {
          "category": "everything_else",
          "multiplier": 1
        }
      ],
      "welcomeBonus": {
        "tiers": [
          {
            "amount": 2500,
            "minSpendCents": 7500,
            "windowMonths": 1
          }
        ],
        "eligibilityRule": "none"
      },
      "perks": [],
      "isActive": true
    },
    {
      "id": "wealthsimple-cash",
      "issuer": "Wealthsimple",
      "name": "Wealthsimple Visa Infinite Card",
      "network": "visa",
      "category": "cashback",
      "currencyId": "cashback",
      "annualFeeCents": 24000,
      "feeWaivedFirstYear": false,
      "fxFeePct": 0,
      "minIncomePersonalCents": 8000000,
      "recommendedCreditScore": "good",
      "earnRules": [
        {
          "category": "everything_else",
          "multiplier": 2
        }
      ],
      "welcomeBonus": null,
      "perks": [],
      "isActive": true
    }
  ],
  "currencies": [
    {
      "id": "cashback",
      "name": "Cash Back",
      "type": "cashback",
      "baselineCpp": 1,
      "maxRealisticCpp": 1,
      "isTerminal": true
    },
    {
      "id": "mr",
      "name": "Amex Membership Rewards",
      "type": "transferable_bank",
      "baselineCpp": 1,
      "maxRealisticCpp": 2.2,
      "isTerminal": false
    },
    {
      "id": "avion",
      "name": "RBC Avion Rewards",
      "type": "transferable_bank",
      "baselineCpp": 1,
      "maxRealisticCpp": 2,
      "isTerminal": false
    },
    {
      "id": "aeroplan",
      "name": "Aeroplan",
      "type": "airline",
      "baselineCpp": 1,
      "maxRealisticCpp": 2,
      "isTerminal": true
    },
    {
      "id": "asia",
      "name": "Cathay Asia Miles",
      "type": "airline",
      "baselineCpp": 1,
      "maxRealisticCpp": 1.5,
      "isTerminal": true
    },
    {
      "id": "avios",
      "name": "British Airways Avios",
      "type": "airline",
      "baselineCpp": 1,
      "maxRealisticCpp": 2,
      "isTerminal": true
    },
    {
      "id": "flyingblue",
      "name": "Flying Blue",
      "type": "airline",
      "baselineCpp": 1,
      "maxRealisticCpp": 2,
      "isTerminal": true
    },
    {
      "id": "sceneplus",
      "name": "Scene+",
      "type": "proprietary",
      "baselineCpp": 1,
      "maxRealisticCpp": 1,
      "isTerminal": true
    },
    {
      "id": "aventura",
      "name": "CIBC Aventura",
      "type": "proprietary",
      "baselineCpp": 1,
      "maxRealisticCpp": 1.2,
      "isTerminal": true
    },
    {
      "id": "bmo",
      "name": "BMO Rewards",
      "type": "proprietary",
      "baselineCpp": 0.67,
      "maxRealisticCpp": 0.7,
      "isTerminal": true
    },
    {
      "id": "westjet",
      "name": "WestJet Rewards",
      "type": "proprietary",
      "baselineCpp": 1,
      "maxRealisticCpp": 1,
      "isTerminal": true
    },
    {
      "id": "tdrewards",
      "name": "TD Rewards",
      "type": "proprietary",
      "baselineCpp": 0.5,
      "maxRealisticCpp": 0.5,
      "isTerminal": true
    },
    {
      "id": "marriott",
      "name": "Marriott Bonvoy",
      "type": "hotel",
      "baselineCpp": 0.7,
      "maxRealisticCpp": 0.9,
      "isTerminal": true
    },
    {
      "id": "porter",
      "name": "Porter VIPorter",
      "type": "proprietary",
      "baselineCpp": 1,
      "maxRealisticCpp": 1.5,
      "isTerminal": true
    },
    {
      "id": "pcoptimum",
      "name": "PC Optimum",
      "type": "proprietary",
      "baselineCpp": 0.1,
      "maxRealisticCpp": 0.1,
      "isTerminal": true
    },
    {
      "id": "nbrewards",
      "name": "National Bank Rewards",
      "type": "proprietary",
      "baselineCpp": 1,
      "maxRealisticCpp": 1,
      "isTerminal": true
    }
  ],
  "transfers": [
    {
      "fromCurrencyId": "mr",
      "toCurrencyId": "aeroplan",
      "ratio": 1,
      "isActive": true
    },
    {
      "fromCurrencyId": "mr",
      "toCurrencyId": "avios",
      "ratio": 1,
      "isActive": true
    },
    {
      "fromCurrencyId": "mr",
      "toCurrencyId": "flyingblue",
      "ratio": 1,
      "isActive": true
    },
    {
      "fromCurrencyId": "mr",
      "toCurrencyId": "asia",
      "ratio": 0.75,
      "isActive": true
    },
    {
      "fromCurrencyId": "avion",
      "toCurrencyId": "avios",
      "ratio": 1,
      "isActive": true
    },
    {
      "fromCurrencyId": "avion",
      "toCurrencyId": "asia",
      "ratio": 1,
      "isActive": true
    },
    {
      "fromCurrencyId": "avion",
      "toCurrencyId": "westjet",
      "ratio": 1,
      "isActive": true
    }
  ],
  "valuations": [
    {
      "currencyId": "cashback",
      "region": "any",
      "cpp": 1
    },
    {
      "currencyId": "mr",
      "region": "any",
      "cpp": 1.25
    },
    {
      "currencyId": "avion",
      "region": "any",
      "cpp": 1.25
    },
    {
      "currencyId": "aeroplan",
      "region": "any",
      "cpp": 1.5
    },
    {
      "currencyId": "aeroplan",
      "region": "domestic",
      "cpp": 1.4
    },
    {
      "currencyId": "aeroplan",
      "region": "north_america",
      "cpp": 1.6
    },
    {
      "currencyId": "aeroplan",
      "region": "europe",
      "cpp": 1.9
    },
    {
      "currencyId": "aeroplan",
      "region": "asia",
      "cpp": 1.7
    },
    {
      "currencyId": "aeroplan",
      "region": "latam",
      "cpp": 1.6
    },
    {
      "currencyId": "asia",
      "region": "any",
      "cpp": 1.2
    },
    {
      "currencyId": "asia",
      "region": "asia",
      "cpp": 1.5
    },
    {
      "currencyId": "asia",
      "region": "europe",
      "cpp": 1.3
    },
    {
      "currencyId": "avios",
      "region": "any",
      "cpp": 1.5
    },
    {
      "currencyId": "avios",
      "region": "europe",
      "cpp": 1.9
    },
    {
      "currencyId": "avios",
      "region": "north_america",
      "cpp": 1.6
    },
    {
      "currencyId": "flyingblue",
      "region": "any",
      "cpp": 1.5
    },
    {
      "currencyId": "flyingblue",
      "region": "europe",
      "cpp": 2
    },
    {
      "currencyId": "sceneplus",
      "region": "any",
      "cpp": 1
    },
    {
      "currencyId": "aventura",
      "region": "any",
      "cpp": 1.1
    },
    {
      "currencyId": "bmo",
      "region": "any",
      "cpp": 0.67
    },
    {
      "currencyId": "westjet",
      "region": "any",
      "cpp": 1
    },
    {
      "currencyId": "westjet",
      "region": "domestic",
      "cpp": 1.1
    },
    {
      "currencyId": "tdrewards",
      "region": "any",
      "cpp": 0.5
    },
    {
      "currencyId": "marriott",
      "region": "any",
      "cpp": 0.8
    },
    {
      "currencyId": "porter",
      "region": "any",
      "cpp": 1.4
    },
    {
      "currencyId": "porter",
      "region": "domestic",
      "cpp": 1.5
    },
    {
      "currencyId": "pcoptimum",
      "region": "any",
      "cpp": 0.1
    },
    {
      "currencyId": "nbrewards",
      "region": "any",
      "cpp": 1
    }
  ]
};
