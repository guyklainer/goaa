module.exports = {
    variants: {
        items: {
            resize: {
                mini : "300x200",
                preview: "800x600"
            },
            crop: {
                thumb: "200x200"
            },
            resizeAndCrop: {
                large: {resize: "1000x1000", crop: "900x900"}
            }
        },

        gallery: {
            crop: {
                thumb: "100x100"
            }
        }
    },

    storage: {
        Rackspace: {
            auth: {
                username: "USERNAME",
                apiKey: "API_KEY",
                host: "lon.auth.api.rackspacecloud.com"
            },
            container: "CONTAINER_NAME"
        },
        S3: {
            key: 'AKIAI2RZRVF5BVXASAUA',
            secret: '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',
            bucket: 'goaa   '
        }
    },

    debug: true
}