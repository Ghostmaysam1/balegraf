import fs from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'

export type InputFileData =
    | string
    | Buffer
    | Readable

export class InputFile {
    readonly source: InputFileData
    readonly fileName?: string

    constructor(
        source: InputFileData,
        fileName?: string
    ) {
        this.source = source
        this.fileName = fileName
    }

    static fromFileId(fileId: string): InputFile {
        return new InputFile(fileId)
    }

    static fromUrl(url: string): InputFile {
        return new InputFile(url)
    }

    static fromBuffer(
        buffer: Buffer,
        fileName: string
    ): InputFile {
        return new InputFile(buffer, fileName)
    }

    static fromStream(
        stream: Readable,
        fileName: string
    ): InputFile {
        return new InputFile(stream, fileName)
    }

    static fromPath(filePath: string): InputFile {
        return new InputFile(
            fs.createReadStream(filePath),
            path.basename(filePath)
        )
    }

    get isUrl(): boolean {
        return (
            typeof this.source === 'string' &&
            /^https?:\/\//.test(this.source)
        )
    }

    get isFileId(): boolean {
        return (
            typeof this.source === 'string' &&
            !this.isUrl
        )
    }

    get isBuffer(): boolean {
        return Buffer.isBuffer(this.source)
    }

    get isStream(): boolean {
        return this.source instanceof Readable
    }

    get needsUpload(): boolean {
        return this.isBuffer || this.isStream
    }
}