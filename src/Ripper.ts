import http from 'http';
import fs from 'fs';
import path from 'path';
import util from 'util';
import url from 'url';

export const exec = util.promisify(require('child_process').exec);

export function download_method(link: string) {
  const parsed = url.parse(link);
  if (['i.redd.it', 'i.reddituploads.com', 'i.imgur.com', 'thumbs.gfycat.com'].includes(parsed.hostname!)){
    return 'wget'
  }
  else if(parsed.hostname?.includes('media.tumblr.com')) {
    return 'wget'
  }
  else if(['www.vidble.com', 'vidble.com'].includes(parsed.hostname!) && (parsed.pathname?.endsWith('.png') || parsed.pathname?.endsWith('.jpg'))) {
    return 'wget'
  }
  else if(['v.redd.it', 'pornhub.com', 'www.pornhub.com', 'www.erome.com', 'erome.com', 'vimeo.com', 'www.vimeo.com', 'gfycat.com', 'www.gfycat.com'].includes(parsed.pathname!)) {
    return 'youtube-dlc'
  }
  else if(['www.vidble.com', 'vidble.com'].includes(parsed.hostname!) && parsed.pathname?.startsWith('/album/')) {
    return 'ripme'
  }
  else if(['www.redgifs.com', 'redgifs.com'].includes(parsed.hostname!)) {
    return 'youtube-dl'
  }
  else {
    return 'other'
  }
}

export function wget(folder: string, link: string): Promise<void> {
  return new Promise((resolve, rejects) => {
    // const http = require('http');
    // const fs = require('fs');
    
    // const file = fs.createWriteStream("file.jpg");
    // const request = http.get("http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg", function(response) {
    //   response.pipe(file);
    // });

    const fileName = url.parse(link).pathname?.split('/').reverse()[0]
    const file = fs.createWriteStream(`${folder}/${fileName}`);
    const request = http.get(link, function(response) {
      response.pipe(file);
      response.on('close', () => {
        resolve();
      });
    });
  });
}

export async function youtubedl(folder: string, link: string) {
  return await exec(`./bin/youtube-dl ${link}`, {
    cwd: path.resolve(folder)
  })
}

export async function ripme(folder: string, link: string) {
  return await exec(`java -jar ./bin/ripme.jar -l ./ -u ${link}`, {
    cwd: path.resolve(folder)
  })
}

export async function download(folder: string, link: string) {
  if(!fs.existsSync(path.resolve(folder))) {
    fs.mkdirSync(path.resolve(folder))
  }
  let method = download_method(link)
  if(method === 'wget') return await wget(folder, link)
  if(method === 'youtube-dl') return await youtubedl(folder, link)
  if(method === 'ripme') return await ripme(folder, link)
}