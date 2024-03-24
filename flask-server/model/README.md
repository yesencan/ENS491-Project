Merhaba, bu proje dosyaları tüm projeyi içermese de yapılan testlerde oluşturulan küçük bir modelin prediction'larını almak için kullanılabilir. Kodda kullanacağınız kısım genel olarak main.py dosyası. Bu dosya da aslında scripts/run/predict.py içinden bir fonksiyon çağırmakta. Aşağıda kod çalışma aşamalarını kısaca özetledim:

- main.py: Çalıştıracağınız script. **python main.py** diyerek çalıştırabilirsiniz. 3 adet parametre alıyor. Default olarak predict şeklinde düzenledim. Config dosyası için de belirtilen config dosyasını kullanabilirsiniz, bir değişiklik yapılmasına gerek yok.
- scripts/run/predict.py: main'de buradaki predict() fonksiyonu çağırılıyor. Yapılan işler data'nın oluşturulup preprocess edilmesi, modelin load edilmesi ve prediction'ların yapılması.
- checkpoints/ : Bu folder'da proteinbert modeli için input embeddingler (checkpoints/proteinbert_embeddings), encoder ve save edilmiş bir model (checkpoints/proteinbert_models) bulunmakta.
- configs/ : Burada config dosyaları yer alıyor. Config formatı değiştirilmemeli ancak data path'leri vb. düzenleyebilirsiniz.

Kısaca şu an python main.py derseniz **dataset/new_dataset/zsl/seed_12345/test_data.csv** datası için prediction'lar oluşturur. Bu prediction'lar sonrasında main içinde results değişkeninde tutulur. Bu prediction'ları görmek için **results.predictions**, prediction probability'ler için **results.probabilities** şeklinde datayı main.py içinde alabilirsiniz. Bu kısmı eklemedim kullanım şeklinize göre düzenleyebilirsiniz. Eğer label'lara ihtiyacınız olursa (Normalde bu label'lar elinizde olmayacak) **results.labels** diyerek bakabilirsiniz.

Ayrıca results.label_mapping dictionary'sinden prediction'ların karşılık geldiği label kinazların isimlerini ve results.kinase_info_dict içinden de bu kinazların aile ve grup bilgilerine erişebilirsiniz.

Input datasını alma şeklinizi değiştirebilir ve kodu düzenleyebilirsiniz. Şu anki formatta **dataset/new_dataset/zsl/seed_12345/test_data.csv** formatında datayı alıyor. Kullanıcıdan input alıp bu formata da getirebilirsiniz veya tamamen data formatını düzenleyebilirsiniz (Doğru çalışıp çalışmadığını test etmenizi öneririm ama bu gibi bir durumda).

Size gönderdiğim model küçük bir model. Çalışma mantığında bir değişim yok ancak 4-5GB bir modeli denemek yerine bu modelle deneyleri yapmak daha kolay olacaktır.

requirements.txt içinde ilgili library ve versiyonları mevcut. Manuel olarak veye pip install -r requirements.txt şeklinde indirebilirsiniz.
