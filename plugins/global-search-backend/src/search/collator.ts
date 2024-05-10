/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Logger } from 'winston';
import { Readable } from 'stream';
import { DocumentCollatorFactory } from '@backstage/plugin-search-common'
import { IndianCitiesDocument } from './document';
import { Permission } from '@backstage/plugin-permission-common';
import { resolvePackagePath } from '@backstage/backend-common';
import fs from 'fs-extra'; 

export type CollatorFactoryOptions = {
    logger: Logger
}

export class CollatorFactory implements DocumentCollatorFactory{
    private readonly baseUrl: string | undefined
    private readonly logger: Logger;
    public readonly type: string = 'global-search';
    private constructor(options: CollatorFactoryOptions){
        this.logger = options.logger;
    }
    visibilityPermission?: Permission | undefined;

    static fromConfig(options:CollatorFactoryOptions){
        return new CollatorFactory({ ...options})
    }

    async getCollator(){
        return Readable.from(this.execute())
    }

    async *execute(): AsyncGenerator<IndianCitiesDocument>{
        this.logger.info('Inside execute function')
        const packagePath = resolvePackagePath("@backstage/plugin-global-search-backend", "assets", "a-detailed-version.json")
        this.logger.info(packagePath)
        // const data = await response.json()
        const packageObj = await fs.readJson(packagePath)
        this.logger.info(packageObj) // => 0.1.3
        
        for(const [city, cityData] of Object.entries(packageObj)){
            yield {
                title: cityData.accentcity,
                text: cityData.accentcity,
                location: `https://google.com/search?q=${city}`,
                city_name: cityData.accentcity,
                lat: cityData.lat,
                long: cityData.long,
                population: cityData.population,
                apiVersion: 'APIVERSION',
                kind: 'KIND',
                metadata: {
                    name: 'metadata.name',
                    description: 
                }
            }
        }
    }
}
