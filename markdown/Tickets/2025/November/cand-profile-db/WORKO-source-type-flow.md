

1. In Apply job api:
   1. Retrieve Candidate Profile by `companyId`,`candidateEmail`(applicant email),`phoneNumberDetails` from `CorporateCandidateProfile.model.ts`
      1. If present:
         1. Check whether `candidateEmail`===`responseCandEmail` 
            1. If same:
               1. Check whether the `userDetailId` is present or not in retrieved `CorporateCandidateProfile` details:
                  1. If present
                     1. Do nothing
                  2. If not present:
                     1. Update `id` attribute of `UserDetail.model.ts` to `userDetailId` in `CorporateCandidateProfile`
                     2. Update `id` attribute of `UserDetail.model.ts` to `userDetailId` in 
                     `CentralCandidateProfile`
                     3. Retrieve Candidate Profile by `companyId`,`email`(applicant email) from `CandidateParsedCv.model.ts`
                        1. Update `id` attribute of `UserDetail.model.ts` to `userDetailId` in `CandidateParsedCv`
               2. Check whether `phoneNumberDetails`===`responsePhoneNumberDetails` same or not:
                  1. If same:
                     1. Do nothing
                  2. If not same:
                     1. Update `phoneNumberDetails` in `CorporateCandidateProfile` with `number` attribute
                     in `UserDetail.model.ts`
                     2. Update `phoneNumberDetails` in `CentralCandidateProfile` with `number` attribute
                     in `UserDetail.model.ts`
                     3. Update `phoneNumberDetails` in `CandidateParsedCv` with `number` attribute
                     in `UserDetail.model.ts`
            2. If not same:
               1. Check whether `phoneNumberDetails`===`responsePhoneNumberDetails` same or not:
                  1. If same:
                     1. Do nothing, because it's a duplicate profile in this company
      2. If not present:
         1. Prepare `CorporateCandidateProfile` create data
         2. Retrieve Candidate Profile by `id`(applicant email) from `CentralCandidateProfile.model.ts`
            1. If present:
               1. Check whether the `userDetailId` is present or not in retrieved `CentralCandidateProfile` details:
                  1. If present
                     1. Do nothing
                  2. If not present:
                     1. Update `id` attribute of `UserDetail.model.ts` to `userDetailId` in `CorporateCandidateProfile`
               2. Update `candidateProfileInCompanies` field with `companyId`,`jobId`,`companyName`
            2. If not present:
               1. Prepare `CentralCandidateProfile` create data
         3. Retrieve Candidate Profile by `companyId`,`email`(applicant email) from `CandidateParsedCv.model.ts`
            1. If present:
            2. If not present:
               1. Prepare `CandidateParsedCv` create data
