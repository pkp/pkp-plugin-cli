const url = require('url')
const http = require('http')
const { readFile } = require('../files')
const { debug, info, error, warn } = require('../log');
const execa = require('execa');

const validateXml = async (fileName) => {
    info('Validating XML file against schema')

    try {
        const xmlSchemaUrl = process.env.XML_SCHEMA || 'http://pkp.sfu.ca/ojs/xml/plugins.xsd'
        await execa('xmllint', ['--schema', xmlSchemaUrl, fileName])
    } catch (err) {
        if (err.toString().match(/xmllint ENOENT/)) {
            warn(`We could not validate the XML against the schema. 
                This is likely because the tool "xmllint" does not exist in your system.
                You can instead open a PR with your new XML, and the build process will run the XML validation.`)

            warn('Ignoring XML validation, and proceeding with next steps.')
        }
        if (err.stderr) {
            error(`\n${err.stderr}\n`)
            throw 'The XML is not valid according to the schema'
        }
    }
}

module.exports = validateXml