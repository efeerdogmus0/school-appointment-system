export const fieldLabels: { [key: string]: string } = {
  appointmentDate: 'Randevu Tarihi',
  appointmentTime: 'Randevu Saati',
  studentName: 'Öğrenci Adı Soyadı',
  studentTC: 'Öğrenci T.C. Kimlik No',
  studentPrevSchool: 'Bitirdiği Okul',
  studentPhone: 'Öğrenci Cep Telefonu',
  studentEmail: 'Öğrenci E-posta Adresi',
  studentAddress: 'Öğrenci İkamet Adresi',
  guardianName: 'Veli Adı Soyadı',
  guardianTC: 'Veli T.C. Kimlik No',
  guardianPhoneCell: 'Veli Cep Telefonu',
  guardianEmail: 'Veli E-posta Adresi',
  guardianAddressHome: 'Veli Ev Adresi',
  guardianProximity: 'Okula Yakınlık Durumu',
  fatherName: 'Baba Adı Soyadı',
  fatherTC: 'Baba T.C. Kimlik No',
  fatherPhone: 'Baba Cep Telefonu',
  fatherEmail: 'Baba E-posta Adresi',
  fatherJob: 'Baba Mesleği',
  fatherWorkplace: 'Baba İşyeri Adı',
  fatherWorkAddress: 'Baba İş Adresi',
  lgsScore: 'LGS Puanı',
  lgsPercentileTurkey: 'LGS Türkiye Geneli Yüzdelik Dilim',
  lgsPercentileCity: 'LGS İl Geneli Yüzdelik Dilim',
  mathCorrect: 'Matematik Doğru',
  mathIncorrect: 'Matematik Yanlış',
  mathNet: 'Matematik Net',
  scienceCorrect: 'Fen Bilimleri Doğru',
  scienceIncorrect: 'Fen Bilimleri Yanlış',
  scienceNet: 'Fen Bilimleri Net',
  turkishCorrect: 'Türkçe Doğru',
  turkishIncorrect: 'Türkçe Yanlış',
  turkishNet: 'Türkçe Net',
  historyCorrect: 'T.C. İnk. Tarihi Doğru',
  historyIncorrect: 'T.C. İnk. Tarihi Yanlış',
  historyNet: 'T.C. İnk. Tarihi Net',
  religionCorrect: 'Din Kültürü Doğru',
  religionIncorrect: 'Din Kültürü Yanlış',
  religionNet: 'Din Kültürü Net',
  englishCorrect: 'Yabancı Dil Doğru',
  englishIncorrect: 'Yabancı Dil Yanlış',
  englishNet: 'Yabancı Dil Net',
  schoolPreference: 'Okulumuzu Kaçıncı Sırada Tercih Ettiniz?',
  schoolChoiceReason: 'Okulumuzu Tercih Etme Nedeniniz',
  hobbies: 'Öğrencinin Hobileri/İlgi Alanları',
  futureGoals: 'Öğrencinin Gelecek Hedefleri',
};

export interface ApplicationData {
  id: string;
  [key: string]: any; // Index signature for dynamic access
  appointmentDate: string;
  appointmentTime: string;
  studentName: string;
  studentTC: string;
  studentPrevSchool: string;
  studentPhone: string;
  studentEmail: string;
  studentAddress: string;
  guardianName: string;
  guardianTC: string;
  guardianPhoneCell: string;
  guardianEmail: string;
  guardianAddressHome: string;
  guardianProximity: string;
  fatherName?: string;
  fatherTC?: string;
  fatherPhone?: string;
  fatherEmail?: string;
  fatherJob?: string;
  fatherWorkplace?: string;
  fatherWorkAddress?: string;
  lgsScore?: number;
  lgsPercentileTurkey?: number;
  lgsPercentileCity?: number;
  mathCorrect?: number;
  mathIncorrect?: number;
  mathNet?: number;
  scienceCorrect?: number;
  scienceIncorrect?: number;
  scienceNet?: number;
  turkishCorrect?: number;
  turkishIncorrect?: number;
  turkishNet?: number;
  historyCorrect?: number;
  historyIncorrect?: number;
  historyNet?: number;
  religionCorrect?: number;
  religionIncorrect?: number;
  religionNet?: number;
  englishCorrect?: number;
  englishIncorrect?: number;
  englishNet?: number;
  schoolPreference?: string;
  schoolChoiceReason?: string;
  hobbies?: string;
  futureGoals?: string;
}
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  studentTC: string;
  studentName: string;
  studentDob: string;
  studentPhone: string;
  guardianName: string;
  guardianPhoneCell: string;
  guardianEmail: string;
  lgsScore?: string;
  lgsPercentileTurkey?: string;
  createdAt: string;
  studentPob?: string;
  studentPrevSchool?: string;
  studentBloodType?: string;
  studentDisability?: string;
  studentChronicIllness?: string;
  parentsTogether?: string;
  parentsBiological?: string;
  guardianEducation?: string;
  guardianOccupation?: string;
  guardianPhoneHome?: string;
  guardianPhoneWork?: string;
  guardianBloodType?: string;
  guardianAddressHome?: string;
  guardianAddressWork?: string;
  guardianChronicIllness?: string;
  guardianDisability?: string;
  guardianIncome?: string;
  fatherName?: string;
  fatherAlive?: string;
  fatherEducation?: string;
  fatherOccupation?: string;
  fatherPhoneCell?: string;
  fatherPhoneHome?: string;
  fatherPhoneWork?: string;
  fatherEmail?: string;
  fatherBloodType?: string;
  fatherAddressHome?: string;
  fatherAddressWork?: string;
  fatherChronicIllness?: string;
  fatherDisability?: string;
  fatherIncome?: string;
  lgsPercentileCity?: string;
  scholarshipWon?: string;
  tubitakInterest?: string;
  turkishCorrect?: string;
  turkishWrong?: string;
  mathCorrect?: string;
  mathWrong?: string;
  scienceCorrect?: string;
  scienceWrong?: string;
  englishCorrect?: string;
  englishWrong?: string;
  religionCorrect?: string;
  religionWrong?: string;
  historyCorrect?: string;
  historyWrong?: string;
  opinionSchool?: string;
  opinionExpectations?: string;
  opinionSuggestions?: string;
  supportSchool?: string;
  joinPta?: string;
}
