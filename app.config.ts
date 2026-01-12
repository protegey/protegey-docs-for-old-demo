export default defineAppConfig({
    docus: {
        title: 'Centry Documentation',
        description: 'The fraud intelligence network powered by Protegey',

        url: 'https://docs.centry.ai',

        socials: {
            github: 'protegey',
            twitter: 'protegey'
        },

        header: {
            title: 'Centry',
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
                text: '© 2026 Centry (by Protegey). All rights reserved.',
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
