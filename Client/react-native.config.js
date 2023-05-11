module.exports = {
    project: {
        ios:{},
        android:{}
    },
    assets:['./assets/fonts/'],
    resolver: {
        assetExts: ['html']
      },
      module: {
        rules: [
          {
            test: /\.html$/,
            use: ['html-loader'],
          },
        ],
      },

      rules: [
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                minimize: true
              }
            }
          ]
        }
      ]
}