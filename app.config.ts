export default defineAppConfig({
    docus: {
        title: 'Protegey Documentation',
        description: 'The fraud intelligence network powered by Centry', // Adjusted description to bridge the gap

        url: 'https://docs.protegey.com',

        socials: {
            github: 'protegey',
            twitter: 'protegey'
        },

        header: {
            title: 'Protegey',
            logo: true,
            showLinkIcon: true
        },

        aside: {
            level: 1,
            collapsed: false,
            exclude: []
        },

        main: {
            padded: true,
            fluid: true
        },

        footer: {
            credits: {
                icon: '',
                text: '© 2026 Protegey. All rights reserved.',
                href: 'https://protegey.com'
            },
            textLinks: [
                {
                    text: 'Privacy Policy',
                    href: 'https://protegey.com/privacy',
                    target: '_blank'
                },
                {
                    text: 'Terms of Service',
                    href: 'https://protegey.com/terms',
                    target: '_blank'
                }
            ],
            iconLinks: []
        }
    }
})
