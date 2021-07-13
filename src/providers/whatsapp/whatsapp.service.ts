import { WAConnection, MessageType, MessageOptions, Mimetype } from '@adiwajshing/baileys'
import { Injectable } from '@nestjs/common';
import * as fs from 'fs'

@Injectable()
export class WhatsAppService {

    private conn = new WAConnection();

    constructor(){
        if (!this.conn.phoneConnected) {
            console.log('==========================');
            console.log('logged');
            console.log('==========================');
            this.initConnection();
        }
    }



    initConnection() {

        this.loadAuthInfo()
            .catch(async (err) => {

                console.log('==========================');
                console.log('Error');
                console.log('==========================');

                await this.connectFirstToWhatsApp()
            })
    }


    private async connectFirstToWhatsApp() {

        // const this.this.conn = new WAConnection()
        // called when WA sends chats
        // this can take up to a few minutes if you have thousands of chats!
        this.conn.on('chats-received', async ({ hasNewChats }) => {
            console.log(`you have ${this.conn.chats.length} chats, new chats available: ${hasNewChats}`)

            const unread = await this.conn.loadAllUnreadMessages()
            console.log("you have " + unread.length + " unread messages")
        })
        // called when WA sends chats
        // this can take up to a few minutes if you have thousands of contacts!
        this.conn.on('contacts-received', () => {
            console.log('you have ' + Object.keys(this.conn.contacts).length + ' contacts')
        })

        this.conn.on('chat-update', chatUpdate => {
            // `chatUpdate` is a partial object, containing the updated properties of the chat
            // received a new message
            if (chatUpdate.messages && chatUpdate.count) {
                const message = chatUpdate.messages.all()[0]
                console.log(message)
            } else console.log(chatUpdate) // see updates (can be archived, pinned etc.)
        })

        this.conn.on('open', () => {
            // save credentials whenever updated
            console.log(`credentials updated!`)
            const authInfo = this.conn.base64EncodedAuthInfo() // get all the auth info we need to restore this session
            fs.writeFileSync('./auth_info.json', JSON.stringify(authInfo, null, '\t')) // save this info to a file
        })

        const qrAccess = fs.existsSync('./auth_info.json')

        if (qrAccess) {
            this.conn.loadAuthInfo('./auth_info.json') // will load JSON credentials from file

        }

        await this.conn.connect() // connect

        console.log('==================================');
        console.log('connections success first time');
        console.log('==================================');

    }

    private async loadAuthInfo() {

        const qrAccess = fs.existsSync('./auth_info.json')
        if (!qrAccess) {

            throw new Error('Error to connect')
        }

        this.conn.loadAuthInfo('./auth_info.json') // will load JSON credentials from file
        await this.conn.connect()
        console.log('==================================');
        console.log('connections success for load access');
        console.log('==================================');

    }


    async sendSimpleText(data: any) {

        

        if (!this.conn.phoneConnected) {
            console.log('==========================');
            console.log('logged');
            console.log('==========================');
            this.initConnection();
        }


        // id = 573143750278
        const id = `${data.phone}@s.whatsapp.net` // the WhatsApp ID 
        // send a simple text!

        console.log('object');

        const sentMsg = await this.conn.sendMessage(id, data.msjText, MessageType.text)
        // send a location!
        // const sentMsg = await this.conn.sendMessage(id, { degreesLatitude: 24.121231, degreesLongitude: 55.1121221 }, MessageType.location)
        // // send a contact!
        // const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
        //     + 'VERSION:3.0\n'
        //     + 'FN:Jeff Singh\n' // full name
        //     + 'ORG:Ashoka Uni;\n' // the organization of the contact
        //     + 'TEL;type=CELL;type=VOICE;waid=911234567890:+91 12345 67890\n' // WhatsApp ID + phone number
        //     + 'END:VCARD'

        // const sentMsg = await this.conn.sendMessage(id, { displayname: "Jeff", vcard: vcard }, MessageType.contact)
    }
}