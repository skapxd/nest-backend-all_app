import { WAConnection, MessageType, MessageOptions, Mimetype } from '@adiwajshing/baileys'
import { Injectable } from '@nestjs/common';
import * as fs from 'fs'
import { async } from 'rxjs';

@Injectable()
export class WhatsAppService {

    private conn = new WAConnection();

    constructor() {


        this.loadConnection()
            .catch((e) => {

                this.initConnection();
            })
    }



    async sendSimpleText(data: any) {


        if (!this.conn.phoneConnected) {
            console.log('==========================');
            console.log('logged');
            console.log('==========================');
            this.loadConnection();
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




    initConnection(): Promise<void> {

        this.conn = new WAConnection()

        return new Promise(
            async (resolve, reject) => {

                try {

                    await this.conn.connect()

                    const authInfo = this.conn.base64EncodedAuthInfo() // get all the auth info we need to restore this session

                    fs.writeFileSync('tokens/auth_info.json', JSON.stringify(authInfo, null, '\t')) // save this info to a file

                    resolve()

                } catch (error) {
                    reject(error)
                }
            }
        )
    }

    async loadConnection() {
        this.conn = new WAConnection()
        this.conn.loadAuthInfo('tokens/auth_info.json') // will load JSON credentials from file

        try {

            await this.conn.connect()
        } catch (error) {
            throw new Error(error.message);

        }
    }


}