import React from "react"
import PropTypes from "prop-types"

export default function HTML(props) {
 return (
  <html {...props.htmlAttributes}>
   <head>
    {/* <script src='https://storage.ko-fi.com/cdn/scripts/overlay-widget.js'></script>
        <script>
          kofiWidgetOverlay.draw('martinmuellerdev', {
            'type': 'floating-chat',
            'floating-chat.donateButton.text': 'Support me',
            'floating-chat.donateButton.background-color': '#00b9fe',
            'floating-chat.donateButton.text-color': '#fff'
          });
        </script> */}

    <meta charSet="utf-8" />
    <meta httpEquiv="x-ua-compatible" content="ie=edge" />
    <meta
     name="viewport"
     content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    
    {/* Preload critical resources */}
    <link rel="preload" href="/avatarIcon.jpeg" as="image" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link rel="preconnect" href="https://www.google-analytics.com" />
    <link rel="dns-prefetch" href="https://api.ab.martinmueller.dev" />
    
    {/* Security headers */}
    <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
    <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
    <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
    
    {props.headComponents}
   </head>
   <body {...props.bodyAttributes}>
    {props.preBodyComponents}
    <noscript key="noscript" id="gatsby-noscript">
     This app works best with JavaScript enabled.
    </noscript>
    <div
     key={`body`}
     id="___gatsby"
     dangerouslySetInnerHTML={{ __html: props.body }}
    />
    {props.postBodyComponents}
    <footer>
     <div id="amzn-assoc-ad-5831d393-b227-4ce9-b453-2f59df9559cc"></div>
     <script
      async
      src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=5831d393-b227-4ce9-b453-2f59df9559cc"
     ></script>
    </footer>

    {/* <script src='https://storage.ko-fi.com/cdn/scripts/overlay-widget.js'></script>
<script>
  kofiWidgetOverlay.draw('martinmuellerdev', {
    'type': 'floating-chat',
    'floating-chat.donateButton.text': 'Support me',
    'floating-chat.donateButton.background-color': '#00b9fe',
    'floating-chat.donateButton.text-color': '#fff'
  });
</script> */}
   </body>
  </html>
 )
}

HTML.propTypes = {
 htmlAttributes: PropTypes.object,
 headComponents: PropTypes.array,
 bodyAttributes: PropTypes.object,
 preBodyComponents: PropTypes.array,
 body: PropTypes.string,
 postBodyComponents: PropTypes.array,
}
