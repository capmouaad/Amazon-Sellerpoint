export const APP_CONFIG = {
  SIGN_UP_STEP: {
    'ConnectAdvertising': {
      key: 'ConnectAdvertising',
      step: 3
    },
    'ConnectSellerCentral': {
      key: 'ConnectSellerCentral',
      step: 2
    }
  },
  LWA_Source: {
    SignUpStep3: {
      state: "108765432",
      destination: '/signup/step-3'
    },
    Configuration: {
      state: "203765410",
      destination: '/dash/configuration/marketplaceconfiguration'
    }
  },
  QS_FIELD_NAME : {
    DataGroupBy: 'DataFieldLabel',
    SellerID: 'SellerID',
    MarketPlaceName: 'MarketPlaceName',
    SellerSKU: 'SellerSKU'
  },
  RELOAD_STATUS_PROGRESS: {
    CogsLoading: 'Your updated COGS data is loading. Typically, this takes serveral minutes.',
    CogsComplete: 'Your COGS update is complete.',
    SkuGroupLoading: 'Your updated SKU Grouping data is loading. Typically, this takes serveral minutes.',
    SkuGroupComplete: 'Your SKU Grouping update is complete.',
    BothLoading: 'Your updated COGS data and SKU Grouping data are loading. Typically, this takes serveral minutes.',
    BothComplete: 'Your COGS and SKU Grouping update are complete.'
  }
}
