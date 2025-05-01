'use server';

import {toast} from 'sonner'; // or your preferred toast library
import { unstable_noStore as noStore } from 'next/cache';

export const executeQuery = async ({jqQuery, fileContent}: {jqQuery:string, fileContent:string}) => {
    noStore();
    try {
        const process = require('child_process').spawn('/usr/bin/jq', ['-c', jqQuery], {
            stdio: ['pipe', 'pipe', 'pipe'],
        });

        process.stdin.write(fileContent);
        process.stdin.end();

        let output = '';
        process.stdout.on('data', (chunk: Buffer) => {
            output += chunk.toString();
        });

        process.stderr.on('data', (chunk: Buffer) => {
            console.error(`stderr: ${chunk}`);
        });

        return new Promise((resolve, reject) => {
            process.on('close', (code) => {
                if (code !== 0) {
                    reject(`jq process exited with code ${code}`);
                    return;
                }
                resolve(output);
            });
        });
    } catch (error: any) {
        console.error("Failed to execute JQ query:", error);
        throw new Error(error.message || "Failed to execute JQ query.");
    }
};
